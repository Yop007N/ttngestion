import React, { useState, useEffect, useMemo } from 'react'
import Map, { Marker, Popup, ViewState } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { AlertCircle, AlertTriangle, Table } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
interface Node {
  id: string
  latitude: number
  longitude: number
  fport: number
  createdAt: string
}

interface Notification {
  id: string
  type: 'outage' | 'failure'
  nodeId: string
  createdAt: string
}

interface DT723Props {
  token: string
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF0aWFndWlsZXJhIiwiYSI6ImNsZHVlOXFqZTA0emczbnA5eWxmaWNia2sifQ.G7L0t9gYA7XpsLuiEuVu1g'

const DT723: React.FC<DT723Props> = ({ token }) => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [viewport, setViewport] = useState<ViewState>({
    latitude: -25.5,
    longitude: -54.6,
    zoom: 10,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  })
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'outage'>('all')
  const [dateFilter, setDateFilter] = useState<string>('')

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/locations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch nodes')
        }
        const data = await response.json()
        setNodes(data)
      } catch (error) {
        console.error('Error fetching nodes:', error)
        setNodes([])
      }
    }

    fetchNodes()
    const interval = setInterval(fetchNodes, 60000)
    return () => clearInterval(interval)
  }, [token])

  useEffect(() => {
    // Datos ficticios para las notificaciones
    const fakeNotifications: Notification[] = Array.from({ length: 10 }, (_, index) => ({
      id: `notification-${index + 1}`,
      type: index % 2 === 0 ? 'outage' : 'failure',
      nodeId: `node-${index + 1}`,
      createdAt: new Date().toISOString()
    }))
    setNotifications(fakeNotifications)
  }, [])

  const getNodeColor = (node: Node) => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const nodeDate = new Date(node.createdAt)
    if (node.fport === 17 && nodeDate > tenMinutesAgo) {
      return 'red'
    } else if (node.fport === 18 && nodeDate > oneWeekAgo) {
      return 'green'
    }
    return 'gray'
  }

  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const nodeColor = getNodeColor(node)
      if (filter === 'all') return true
      if (filter === 'active' && nodeColor === 'green') return true
      if (filter === 'inactive' && nodeColor === 'gray') return true
      if (filter === 'outage' && nodeColor === 'red') return true
      return false
    })
  }, [nodes, filter])

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header con filtro centrado */}
      <header className="flex justify-between bg-gray-800 p-4 items-center text-white">
        <h1 className="text-xl">DT723 Monitoreo de Cortes de Energía</h1>
        <div className="flex space-x-4">
          <Select value={filter} onValueChange={(value: 'all' | 'active' | 'inactive' | 'outage') => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar nodos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los nodos</SelectItem>
              <SelectItem value="active">Nodos activos</SelectItem>
              <SelectItem value="inactive">Nodos inactivos</SelectItem>
              <SelectItem value="outage">Posibles cortes</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-[180px]"
          />
        </div>
      </header>

      {/* Mapa expandido */}
      <div className="flex-grow" style={{ height: 'calc(100vh - 320px)' }}>
        <Map
          {...viewport}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/dark-v10"
          onMove={(evt) => setViewport(evt.viewState)}
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {filteredNodes.map((node) => (
            <Marker key={node.id} longitude={node.longitude} latitude={node.latitude} color={getNodeColor(node)}>
              <div onClick={() => setSelectedNode(node)}>
                <svg
                  height={20}
                  width={20}
                  style={{
                    cursor: 'pointer',
                    fill: getNodeColor(node),
                    stroke: 'none'
                  }}
                >
                  <circle cx="10" cy="10" r="5" />
                </svg>
              </div>
            </Marker>
          ))}

          {selectedNode && (
            <Popup
              longitude={selectedNode.longitude}
              latitude={selectedNode.latitude}
              onClose={() => setSelectedNode(null)}
            >
              <div>
                <h4>Node ID: {selectedNode.id}</h4>
                <p>Created At: {selectedNode.createdAt}</p>
              </div>
            </Popup>
          )}
        </Map>
      </div>


    </div>
  )
}

export default DT723
