import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Box, Wifi, Settings, LogOut, Menu, Zap } from 'lucide-react'

interface PropsDiseño {
  onCerrarSesion: () => void
}

export default function Diseño({ onCerrarSesion }: PropsDiseño) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const ubicacion = useLocation()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const elementosNav = [
    { ruta: '/', icono: Home, etiqueta: 'Panel de Control' },
    { ruta: '/applications', icono: Box, etiqueta: 'Aplicaciones' },
    { ruta: '/devices', icono: Wifi, etiqueta: 'Dispositivos' },
    { ruta: '/gateways', icono: Settings, etiqueta: 'Gateways' },
    { ruta: '/mqtt', icono: Settings, etiqueta: 'Configuración MQTT' },
    { ruta: '/dt723', icono: Zap, etiqueta: 'DT-723   Monitoreo de Cortes de Energía' },
  ]

  // Definir el título basado en la ruta actual
  const getTitle = () => {
    const currentRoute = ubicacion.pathname
    const matchedItem = elementosNav.find((item) => item.ruta === currentRoute)
    return matchedItem ? matchedItem.etiqueta : 'Panel de Control'
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-400 to-green-400">
      <nav
        className={`bg-gray-900 shadow-lg flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-center">
            <img src="/icon-pti.png" alt="PTI Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-bold text-white text-center">
              IoT Parque Tecnológico Itaipu
            </h1>
          </div>
        </div>
        <ul className="flex-grow space-y-2 p-4">
          {elementosNav.map((elemento) => (
            <li key={elemento.ruta}>
              <Link
                to={elemento.ruta}
                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                  ubicacion.pathname === elemento.ruta
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <elemento.icono className="h-5 w-5 mr-3" />
                {elemento.etiqueta}
              </Link>
            </li>
          ))}
        </ul>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onCerrarSesion}
            className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white rounded-md transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </nav>
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex items-center justify-center relative">
          <button
            onClick={toggleSidebar}
            className="text-white p-2 rounded-md hover:bg-gray-700 absolute left-4"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-bold">{getTitle()}</h2>
        </header>
        <main className="flex-1 p-8 overflow-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
