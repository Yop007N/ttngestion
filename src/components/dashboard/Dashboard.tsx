import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function PanelDeControl() {
  const estadisticas = {
    gatewaysActivos: 15,
    dispositivosActivos: 150,
    aplicacionesActivas: 5,
  }

  const datosTráfico = [
    { nombre: 'Gateway 1', downlink: 400, uplink: 240 },
    { nombre: 'Gateway 2', downlink: 300, uplink: 139 },
    { nombre: 'Gateway 3', downlink: 200, uplink: 980 },
    { nombre: 'Gateway 4', downlink: 278, uplink: 390 },
    { nombre: 'Gateway 5', downlink: 189, bajada: 480 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-green-400 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Gateways Activos</h3>
            <p className="text-4xl font-bold text-blue-400">{estadisticas.gatewaysActivos}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Dispositivos Activos</h3>
            <p className="text-4xl font-bold text-green-400">{estadisticas.dispositivosActivos}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Aplicaciones Activas</h3>
            <p className="text-4xl font-bold text-purple-400">{estadisticas.aplicacionesActivas}</p>
          </div>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Tráfico de Gateways</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={datosTráfico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="nombre" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value} paquetes`, name === 'subida' ? 'Subida' : 'Bajada']} 
                labelFormatter={label => `Gateway: ${label}`}
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Legend 
                wrapperStyle={{ color: '#E5E7EB' }}
              />
              <Bar dataKey="downlink" fill="#8B5CF6" name="downlink" />
              <Bar dataKey="uplink" fill="#10B981" name="uplink" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}