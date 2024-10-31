import React, { useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { Key, Copy } from 'lucide-react'

interface PropsMQTTConfig {
  token: string
}

interface ConfiguracionMQTT {
  direccionPublica: string
  direccionPublicaTLS: string
  nombreUsuario: string
}

export default function ConfiguracionMQTTComponent({ token }: PropsMQTTConfig) {
  const [config] = useState<ConfiguracionMQTT>({
    direccionPublica: '10.4.33.18:1883',
    direccionPublicaTLS: '10.4.33.18:8883',
    nombreUsuario: 'adaptador-iot',
  })
  const [claveAPI, setClaveAPI] = useState<string>('')

  const generarNuevaClaveAPI = () => {
    const nuevaClave = Math.random().toString(36).substr(2, 15)
    setClaveAPI(nuevaClave)
  }

  const copiarAlPortapapeles = (texto: string) => {
    navigator.clipboard.writeText(texto)
      .then(() => {
        console.log('Texto copiado al portapapeles')
      })
      .catch(err => {
        console.error('Error al copiar texto: ', err)
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-green-400 p-4">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-md overflow-hidden p-6">
       
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Información de Conexión</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="direccionPublica" className="block text-sm font-medium text-gray-300">Dirección Pública</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="direccionPublica"
                    value={config.direccionPublica}
                    readOnly
                    className="flex-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => copiarAlPortapapeles(config.direccionPublica)}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-600 rounded-r-md bg-gray-700 text-gray-300 hover:bg-gray-600"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="direccionPublicaTLS" className="block text-sm font-medium text-gray-300">Dirección Pública TLS</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="direccionPublicaTLS"
                    value={config.direccionPublicaTLS}
                    readOnly
                    className="flex-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => copiarAlPortapapeles(config.direccionPublicaTLS)}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-600 rounded-r-md bg-gray-700 text-gray-300 hover:bg-gray-600"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Credenciales de Conexión</h3>
            <div>
              <label htmlFor="nombreUsuario" className="block text-sm font-medium text-gray-300">Nombre de Usuario</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="nombreUsuario"
                  value={config.nombreUsuario}
                  readOnly
                  className="flex-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => copiarAlPortapapeles(config.nombreUsuario)}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-600 rounded-r-md bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Token de Acceso</h3>
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-300">Token</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="token"
                  value={token}
                  readOnly
                  className="flex-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => copiarAlPortapapeles(token)}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-600 rounded-r-md bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="claveAPI" className="block text-sm font-medium text-gray-300">Clave API</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="claveAPI"
                value={claveAPI}
                readOnly
                className="flex-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={generarNuevaClaveAPI}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Key className="h-5 w-5 mr-2" />
                Generar nueva Clave API
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}