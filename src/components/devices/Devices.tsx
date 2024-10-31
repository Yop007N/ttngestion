import React, { useState, useEffect, useCallback } from "react";

const API_BASE_URL = "https://10.4.33.17/api/v3";

interface Aplicacion {
  id: string;
  nombre: string;
}

export default function Devices() {
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [aplicacionSeleccionada, setAplicacionSeleccionada] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nodo, setNodo] = useState({
    device_id: "",
    dev_eui: "",
    app_key: ""
  });

  // Obtener el token y el userId desde localStorage
  const token = localStorage.getItem("ttnToken");
  const userId = localStorage.getItem("ttnUserId");

  // Verificar si el token ya tiene "Bearer " y si no lo tiene, agregarlo
  const authHeader = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

  // Función para obtener aplicaciones
  const obtenerAplicaciones = useCallback(async () => {
    if (!authHeader || !userId) {
      setError("No se encontraron credenciales. Por favor, inicie sesión nuevamente.");
      return;
    }

    try {
      const respuesta = await fetch(`${API_BASE_URL}/users/${userId}/applications`, {
        headers: {
          Authorization: authHeader, // Usar el token revisado en el encabezado
        },
      });

      if (respuesta.ok) {
        const datos = await respuesta.json();
        if (datos && datos.applications) {
          setAplicaciones(
            datos.applications.map((app: any) => ({
              id: app.ids.application_id,
              nombre: app.ids.application_id, // Usar application_id para ambos campos
            }))
          );
        }
      } else {
        throw new Error("Error al obtener las aplicaciones");
      }
    } catch (error) {
      console.error("Error al obtener las aplicaciones:", error);
      setError("Error al obtener las aplicaciones.");
    }
  }, [authHeader, userId]);

  useEffect(() => {
    obtenerAplicaciones();
  }, [obtenerAplicaciones]);

  // Manejador de selección de aplicación
  const manejarSeleccionAplicacion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAplicacionSeleccionada(e.target.value);
  };

  // Manejador de cambios en el formulario de nodo
  const manejarCambioNodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNodo((prevNodo) => ({
      ...prevNodo,
      [name]: value,
    }));
  };

  // Manejador para crear nodo
  const manejarEnvioNodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader || !aplicacionSeleccionada) {
      setError("No se encontraron credenciales o no se seleccionó una aplicación.");
      return;
    }

    setIsLoading(true);
    try {
      const respuesta = await fetch(`${API_BASE_URL}/applications/${aplicacionSeleccionada}/devices`, {
        method: "POST",
        headers: {
          Authorization: authHeader, // Usar el token revisado en el encabezado
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          end_device: {
            ids: {
              device_id: nodo.device_id,
              dev_eui: nodo.dev_eui,
            },
            root_keys: {
              app_key: {
                key: nodo.app_key,
              },
            },
            network_server_address: "10.4.33.18",
            application_server_address: "10.4.33.18",
            join_server_address: "10.4.33.18",
          },
        }),
      });

      if (respuesta.ok) {
        const resultado = await respuesta.json();
        console.log("Nodo creado:", resultado);
        setError("");
        setNodo({ device_id: "", dev_eui: "", app_key: "" }); // Limpiar el formulario después de crear el nodo
      } else {
        const detallesError = await respuesta.json();
        throw new Error(`Error: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error("Error al crear el nodo:", error);
      setError("Error al crear el nodo. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-green-400 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold text-white">Gestión de Dispositivos</h1>

        {/* Combo para seleccionar la aplicación */}
        <div className="mb-4">
          <label htmlFor="aplicaciones" className="block text-sm font-medium text-gray-300">
            Seleccionar Aplicación
          </label>
          <select
            id="aplicaciones"
            name="aplicaciones"
            value={aplicacionSeleccionada || ""}
            onChange={manejarSeleccionAplicacion}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
          >
            <option value="" disabled>
              -- Seleccione una aplicación --
            </option>
            {aplicaciones.map((app) => (
              <option key={app.id} value={app.id}>
                {app.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Formulario de carga de nodo cuando una aplicación esté seleccionada */}
        {aplicacionSeleccionada && (
          <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">Agregar Nodo a la Aplicación</h2>
            <form onSubmit={manejarEnvioNodo}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="device_id" className="block text-sm font-medium text-gray-300">
                    ID del Dispositivo
                  </label>
                  <input
                    type="text"
                    id="device_id"
                    name="device_id"
                    value={nodo.device_id}
                    onChange={manejarCambioNodo}
                    className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    placeholder="Ingrese el ID del dispositivo"
                  />
                </div>
                <div>
                  <label htmlFor="dev_eui" className="block text-sm font-medium text-gray-300">
                    Dev EUI
                  </label>
                  <input
                    type="text"
                    id="dev_eui"
                    name="dev_eui"
                    value={nodo.dev_eui}
                    onChange={manejarCambioNodo}
                    className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    placeholder="Ingrese el Dev EUI"
                  />
                </div>
                <div>
                  <label htmlFor="app_key" className="block text-sm font-medium text-gray-300">
                    App Key
                  </label>
                  <input
                    type="text"
                    id="app_key"
                    name="app_key"
                    value={nodo.app_key}
                    onChange={manejarCambioNodo}
                    className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    placeholder="Ingrese el App Key"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Cargando..." : "Agregar Nodo"}
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-md flex items-center" role="alert">
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
