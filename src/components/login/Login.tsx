import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, User, Key, LogIn, Loader } from 'lucide-react'

const API_BASE_URL = 'https://10.4.33.17/api/v3'
interface LoginProps {
  onLogin: (token: string, userId: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = localStorage.getItem('ttnToken')
    const storedUserId = localStorage.getItem('ttnUserId')
    if (storedToken && storedUserId) {
      onLogin(storedToken, storedUserId)
      navigate('/')
    }
  }, [onLogin, navigate])

  const validateToken = async (token: string, userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          'Authorization': token
        }
      })

      if (!response.ok) {
        throw new Error('Token inválido o ID de usuario incorrecto')
      }

      return true
    } catch (error) {
      console.error('Error validating token:', error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const fullToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`

    try {
      const isValid = await validateToken(fullToken, userId)

      if (isValid) {
        localStorage.setItem('ttnToken', fullToken)
        localStorage.setItem('ttnUserId', userId)
        onLogin(fullToken, userId)
        navigate('/')
      } else {
        throw new Error('Token o ID de usuario inválido')
      }
    } catch (err) {
      console.error('Error durante el inicio de sesión:', err)
      setError('Token o ID de usuario inválido. Por favor, verifique e intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-green-400 p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-2xl">
        <div><img src="/icon-pti.png" alt="PTI Logo" className="mx-auto h-32 w-auto" />

          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
           Iniciar
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Ingrese su token y ID de usuario de The Things Network
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="token" className="sr-only">Token TTN</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 left-0 flex items-center pl-10 pr-3 bg-gray-700 rounded-tl-md">
                  <span className="text-gray-400 sm:text-sm">Bearer</span>
                </div>
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-32 border border-gray-600 placeholder-gray-500 text-white bg-gray-800 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="NNSXS.XXXXXXXXXXXXXXXXXXXXXXX"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="userId" className="sr-only">ID de Usuario TTN</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-gray-800 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="ID de Usuario TTN"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center text-red-500 text-sm mt-2" role="alert">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Conectando...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Conectar a TTN
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}