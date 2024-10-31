import React, { useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { AlertCircle, Upload, Download, MapPin } from 'lucide-react'

interface Gateway {
  id: string
  nombre: string
  planFrecuencia: string
  latitud: number
  longitud: number
  altitud: number
  estado: 'online' | 'offline'
}

export default function Gateways() {
  const [gateways, setGateways] = useState<Gateway[]>([])
  const [nuevoGateway, setNuevoGateway] = useState<Partial<Gateway>>({})
  const [datosCargaMasiva, setDatosCargaMasiva] = useState<string>('')
  const [error, setError] = useState<string>('')

  const manejarCambioInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNuevoGateway({ ...nuevoGateway, [e.target.name]: e.target.value })
  }

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault()
    if (nuevoGateway.id && nuevoGateway.nombre && nuevoGateway.planFrecuencia && 
        nuevoGateway.latitud !== undefined && nuevoGateway.longitud !== undefined && nuevoGateway.altitud !== undefined) {
      setGateways([...gateways, { ...nuevoGateway, id: nuevoGateway.id, estado: 'offline' } as Gateway])
      setNuevoGateway({})
      setError('')
    } else {
      setError('Por favor, complete todos los campos.')
    }
  }

  const manejarCargaMasiva = () => {
    try {
      const datosParsed = JSON.parse(datosCargaMasiva)
      if (Array.isArray(datosParsed)) {
        setGateways([...gateways, ...datosParsed])
        setDatosCargaMasiva('')
        setError('')
      } else {
        throw new Error('Los datos deben ser un array de gateways')
      }
    } catch (error) {
      setError('Datos JSON inválidos. Por favor, verifique el formato.')
    }
  }

  const descargarPlantilla = () => {
    const plantilla = [
      {
        id: 'ejemplo-id',
        nombre: 'Gateway de Ejemplo',
        planFrecuencia: 'EU868',
        latitud: 0,
        longitud: 0,
        altitud: 0,
        estado: 'offline'
      }
    ]
    const blob = new Blob([JSON.stringify(plantilla, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'plantilla-gateway.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-green-400 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
       
        
        <form onSubmit={manejarEnvio} className="bg-gray-900 p-6 rounded-xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-300">ID del Gateway</label>
              <input
                type="text"
                id="id"
                name="id"
                value={nuevoGateway.id || ''}
                onChange={manejarCambioInput}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese el ID del gateway"
                data-tooltip-id="gateway-id-tooltip"
                data-tooltip-content="Un identificador único para este gateway en TTN"
              />
              <Tooltip id="gateway-id-tooltip" />
            </div>
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={nuevoGateway.nombre || ''}
                onChange={manejarCambioInput}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese el nombre del gateway"
                data-tooltip-id="gateway-name-tooltip"
                data-tooltip-content="Un nombre amigable para identificar el gateway"
              />
              <Tooltip id="gateway-name-tooltip" />
            </div>
            <div>
              <label htmlFor="planFrecuencia" className="block text-sm font-medium text-gray-300">Plan de Frecuencia</label>
              <select
                id="planFrecuencia"
                name="planFrecuencia"
                value={nuevoGateway.planFrecuencia || ''}
                onChange={manejarCambioInput}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-tooltip-id="frequency-plan-tooltip"
                data-tooltip-content="Selecciona el plan de frecuencia correspondiente a la ubicación del gateway"
              >
                <option value="">Selecciona un plan</option>
                <option value="EU868">EU868</option>
                <option value="US915">US915</option>
                <option value="AS923">AS923</option>
              </select>
              <Tooltip id="frequency-plan-tooltip" />
            </div>
            <div>
              <label htmlFor="latitud" className="block text-sm font-medium text-gray-300">Latitud</label>
              <input
                type="number"
                id="latitud"
                name="latitud"
                value={nuevoGateway.latitud || ''}
                onChange={manejarCambioInput}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese la latitud"
                data-tooltip-id="latitude-tooltip"
                data-tooltip-content="Especifica la coordenada de latitud del gateway"
              />
              <Tooltip id="latitude-tooltip" />
            </div>
            <div>
              <label htmlFor="longitud" className="block text-sm font-medium text-gray-300">Longitud</label>
              <input
                type="number"
                id="longitud"
                name="longitud"
                value={nuevoGateway.longitud || ''}
                onChange={manejarCambioInput}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese la longitud"
                data-tooltip-id="longitude-tooltip"
                data-tooltip-content="Especifica la coordenada de longitud del gateway"
              />
              <Tooltip id="longitude-tooltip" />
            </div>
            <div>
              <label htmlFor="altitud" className="block text-sm font-medium text-gray-300">Altitud</label>
              <input
                type="number"
                id="altitud"
                name="altitud"
                value={nuevoGateway.altitud || ''}
                onChange={manejarCambioInput}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese la altitud"
                data-tooltip-id="altitude-tooltip"
                data-tooltip-content="Especifica la altitud del gateway en metros"
              />
              <Tooltip id="altitude-tooltip" />
            </div>
          </div>
          <button type="submit" className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Agregar Gateway
          </button>
        </form>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-md flex items-center" role="alert">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-4">Carga Masiva</h3>
          <textarea
            value={datosCargaMasiva}
            onChange={(e) => setDatosCargaMasiva(e.target.value)}
            className="w-full h-32 p-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Pegue los datos JSON aquí"
          />
          <div className="mt-4 flex space-x-4">
            <button onClick={manejarCargaMasiva} className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <Upload className="h-5 w-5 mr-2" />
              Subir
            </button>
            <button onClick={descargarPlantilla} className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <Download className="h-5 w-5 mr-2" />
              Descargar Plantilla
            </button>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-4">Lista de Gateways</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Plan de Frecuencia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ubicación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {gateways.map((gateway) => (
                  <tr key={gateway.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{gateway.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{gateway.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{gateway.planFrecuencia}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <MapPin className="h-4 w-4 inline-block mr-1" />
                      {gateway.latitud}, {gateway.longitud}, {gateway.altitud}m
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gateway.estado === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {gateway.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}