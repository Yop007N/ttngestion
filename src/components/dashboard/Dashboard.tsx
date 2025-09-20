import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Statistics {
  gatewaysActivos: number;
  dispositivosActivos: number;
  aplicacionesActivas: number;
}

interface TrafficData {
  nombre: string;
  downlink: number;
  uplink: number;
}

export default function Dashboard() {
  const [estadisticas, setEstadisticas] = useState<Statistics>({
    gatewaysActivos: 0,
    dispositivosActivos: 0,
    aplicacionesActivas: 0,
  });

  const [datosTráfico, setDatosTráfico] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API calls - replace with real API endpoints
        await new Promise(resolve => setTimeout(resolve, 1000));

        setEstadisticas({
          gatewaysActivos: 15,
          dispositivosActivos: 150,
          aplicacionesActivas: 5,
        });

        setDatosTráfico([
          { nombre: 'Gateway 1', downlink: 400, uplink: 240 },
          { nombre: 'Gateway 2', downlink: 300, uplink: 139 },
          { nombre: 'Gateway 3', downlink: 200, uplink: 980 },
          { nombre: 'Gateway 4', downlink: 278, uplink: 390 },
          { nombre: 'Gateway 5', downlink: 189, uplink: 480 },
        ]);
      } catch (err) {
        setError('Error al cargar datos del dashboard');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-green-400 p-4 flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-xl shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-white mt-4">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-green-400 p-4 flex items-center justify-center">
        <div className="bg-red-900 p-8 rounded-xl shadow-2xl">
          <p className="text-red-200">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-green-400 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Panel de Control TTN</h1>
          <p className="text-blue-100">Monitoreo en tiempo real de la red</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-xl shadow-2xl transition-transform hover:scale-105">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Gateways Activos</h3>
            <p className="text-4xl font-bold text-blue-400">{estadisticas.gatewaysActivos}</p>
            <p className="text-sm text-gray-400 mt-2">+2 desde ayer</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-2xl transition-transform hover:scale-105">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Dispositivos Activos</h3>
            <p className="text-4xl font-bold text-green-400">{estadisticas.dispositivosActivos}</p>
            <p className="text-sm text-gray-400 mt-2">+15 desde ayer</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-2xl transition-transform hover:scale-105">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Aplicaciones Activas</h3>
            <p className="text-4xl font-bold text-purple-400">{estadisticas.aplicacionesActivas}</p>
            <p className="text-sm text-gray-400 mt-2">Sin cambios</p>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Tráfico de Gateways</h3>
            <button
              onClick={() => {
                // Add refresh functionality
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              Actualizar
            </button>
          </div>
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
                formatter={(value, name) => [`${value} paquetes`, name === 'uplink' ? 'Uplink' : 'Downlink']}
                labelFormatter={label => `Gateway: ${label}`}
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Legend
                wrapperStyle={{ color: '#E5E7EB' }}
              />
              <Bar dataKey="downlink" fill="#8B5CF6" name="Downlink" />
              <Bar dataKey="uplink" fill="#10B981" name="Uplink" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}