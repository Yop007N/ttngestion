import React, { useState, useEffect, useCallback } from "react";
import { Tooltip } from "react-tooltip";
import {
  AlertCircle,
  Edit,
  Trash2,
  Key,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import Header from "../header";

//const API_BASE_URL = "https://10.4.33.18/api/v3";
const API_BASE_URL = "https://10.4.33.17/api/v3";
interface Aplicacion {
  id: string;
  nombre: string;
  region: string;
}

interface APIKey {
  id: string;
  name: string;
  rights: string[];
  expiresAt?: string;
}

export default function Aplicaciones() {
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [nuevaAplicacion, setNuevaAplicacion] = useState<Partial<Aplicacion>>(
    {}
  );
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [nuevaApiKey, setNuevaApiKey] = useState<Partial<APIKey>>({});
  const [editando, setEditando] = useState(false);
  const [aplicacionSeleccionada, setAplicacionSeleccionada] = useState<
    string | null
  >(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);

  const token = localStorage.getItem("ttnToken");
  const userId = localStorage.getItem("ttnUserId");

  const obtenerAplicaciones = useCallback(async () => {
    if (!token || !userId) {
      setError(
        "No se encontraron credenciales. Por favor, inicie sesión nuevamente."
      );
      return;
    }

    setIsLoading(true);
    try {
      const respuesta = await fetch(
        `${API_BASE_URL}/users/${userId}/applications`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (respuesta.ok) {
        const datos = await respuesta.json();
        console.log("Respuesta de la API:", datos);

        if (datos && datos.applications) {
          setAplicaciones(
            datos.applications.map((app: any) => ({
              id: app.ids.application_id,
              nombre: app.name || "Aplicación sin nombre",
              region: app.network_server_address || "Región desconocida",
            }))
          );
        }
      } else {
        throw new Error("Error al obtener las aplicaciones");
      }
    } catch (error) {
      console.error("Error al obtener las aplicaciones:", error);
      setError(
        "Error al obtener las aplicaciones. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    obtenerAplicaciones();
  }, [obtenerAplicaciones]);

  const obtenerApiKeys = useCallback(
    async (applicationId: string) => {
      if (!token) {
        setError(
          "No se encontraron credenciales. Por favor, inicie sesión nuevamente."
        );
        return;
      }

      setIsLoading(true);
      try {
        const respuesta = await fetch(
          `${API_BASE_URL}/applications/${applicationId}/api-keys`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (respuesta.ok) {
          const datos = await respuesta.json();
          console.log("API Keys:", datos);

          if (datos && datos.api_keys) {
            setApiKeys(datos.api_keys);
          }
        } else {
          throw new Error("Error al obtener las API keys");
        }
      } catch (error) {
        console.error("Error al obtener las API keys:", error);
        setError(
          "Error al obtener las API keys. Por favor, intente nuevamente."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const crearApiKey = async (applicationId: string) => {
    if (!token) {
      setError(
        "No se encontraron credenciales. Por favor, inicie sesión nuevamente."
      );
      return;
    }

    setIsLoading(true);
    try {
      const respuesta = await fetch(
        `${API_BASE_URL}/applications/${applicationId}/api-keys`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nuevaApiKey.name,
            rights: nuevaApiKey.rights,
            expires_at: nuevaApiKey.expiresAt,
          }),
        }
      );

      if (respuesta.ok) {
        const datos = await respuesta.json();
        console.log("Nueva API Key creada:", datos);
        obtenerApiKeys(applicationId);
        setNuevaApiKey({});
      } else {
        throw new Error("Error al crear la API key");
      }
    } catch (error) {
      console.error("Error al crear la API key:", error);
      setError("Error al crear la API key. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarApiKey = async (applicationId: string, apiKeyId: string) => {
    if (!token) {
      setError(
        "No se encontraron credenciales. Por favor, inicie sesión nuevamente."
      );
      return;
    }

    setIsLoading(true);
    try {
      const respuesta = await fetch(
        `${API_BASE_URL}/applications/${applicationId}/api-keys/${apiKeyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      if (respuesta.ok) {
        console.log("API Key eliminada");
        obtenerApiKeys(applicationId);
      } else {
        throw new Error("Error al eliminar la API key");
      }
    } catch (error) {
      console.error("Error al eliminar la API key:", error);
      setError("Error al eliminar la API key. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const manejarCambioInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNuevaAplicacion({ ...nuevaAplicacion, [e.target.name]: e.target.value });
  };

  const manejarCambioApiKey = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNuevaApiKey({ ...nuevaApiKey, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !userId) {
      setError(
        "No se encontraron credenciales. Por favor, inicie sesión nuevamente."
      );
      return;
    }

    setIsLoading(true);
    const metodo = editando ? "PUT" : "POST";
    const url = editando
      ? `${API_BASE_URL}/applications/${aplicacionSeleccionada}`
      : `${API_BASE_URL}/users/${userId}/applications`;

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          application: {
            ids: { application_id: nuevaAplicacion.id },
            name: nuevaAplicacion.nombre || "Aplicación sin nombre",
            description: "Aplicación para mis dispositivos",
            network_server_address: nuevaAplicacion.region || "10.4.33.18",
            application_server_address: "10.4.33.18",
            join_server_address: "10.4.33.18",
          },
        }),
      });

      if (respuesta.ok) {
        const resultado = await respuesta.json();
        await obtenerAplicaciones();
        setNuevaAplicacion({});
        setEditando(false);
        setAplicacionSeleccionada(null);
        setError("");
      } else {
        const detallesError = await respuesta.json();
        throw new Error(`Error: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error("Error al crear o actualizar la aplicación:", error);
      setError(
        "Error al crear o actualizar la aplicación. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const manejarEliminar = async (id: string) => {
    if (!token) {
      setError(
        "No se encontraron credenciales. Por favor, inicie sesión nuevamente."
      );
      return;
    }

    setIsLoading(true);
    try {
      const respuesta = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });
      if (respuesta.ok) {
        await obtenerAplicaciones();
        setError("");
      } else {
        throw new Error("Error al eliminar la aplicación");
      }
    } catch (error) {
      console.error("Error al eliminar la aplicación:", error);
      setError(
        "Error al eliminar la aplicación. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const manejarEditar = (app: Aplicacion) => {
    setNuevaAplicacion(app);
    setAplicacionSeleccionada(app.id);
    setEditando(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-green-400 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <form
          onSubmit={manejarEnvio}
          className="bg-gray-900 p-6 rounded-xl shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="id"
                className="block text-sm font-medium text-gray-300"
              >
                ID de la Aplicación
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={nuevaAplicacion.id || ""}
                onChange={manejarCambioInput}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese el ID de la aplicación"
                data-tooltip-id="tooltip-id-aplicacion"
                data-tooltip-content="Un identificador único para la aplicación en TTN"
              />
              <Tooltip id="tooltip-id-aplicacion" />
            </div>
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-300"
              >
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={nuevaAplicacion.nombre || ""}
                onChange={manejarCambioInput}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese el nombre de la aplicación"
                data-tooltip-id="tooltip-nombre-aplicacion"
                data-tooltip-content="El nombre utilizado para identificar la aplicación"
              />
              <Tooltip id="tooltip-nombre-aplicacion" />
            </div>
            
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                Procesando...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                {editando ? "Actualizar Aplicación" : "Agregar Aplicación"}
              </>
            )}
          </button>
        </form>

        {error && (
          <div
            className="bg-red-500 text-white p-4 rounded-md flex items-center"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">
              Lista de Aplicaciones
            </h3>
            <button
              onClick={obtenerAplicaciones}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Actualizar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {aplicaciones.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {app.id}
                    </td>
                  
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => manejarEditar(app)}
                        className="text-blue-400 hover:text-blue-300 mr-4"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => manejarEliminar(app.id)}
                        className="text-red-400 hover:text-red-300 mr-4"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setAplicacionSeleccionada(app.id);
                          obtenerApiKeys(app.id);
                          setShowApiKeys(!showApiKeys);
                        }}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        {showApiKeys && aplicacionSeleccionada === app.id ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showApiKeys && aplicacionSeleccionada && (
          <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              API Keys para {aplicacionSeleccionada}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                crearApiKey(aplicacionSeleccionada);
              }}
              className="mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="name"
                  value={nuevaApiKey.name || ""}
                  onChange={manejarCambioApiKey}
                  placeholder="Nombre de la API Key"
                  className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="rights"
                  value={nuevaApiKey.rights?.join(",") || ""}
                  onChange={(e) =>
                    setNuevaApiKey({
                      ...nuevaApiKey,
                      rights: e.target.value.split(","),
                    })
                  }
                  placeholder="Permisos (separados por comas)"
                  className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Crear API Key
                    </>
                  )}
                </button>
              </div>
            </form>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Permisos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Expira
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {apiKeys.map((key) => (
                    <tr key={key.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {key.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {key.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {key.rights.join(", ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {key.expiresAt || "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            eliminarApiKey(aplicacionSeleccionada, key.id)
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
