# TTN Management System 🔌

> Sistema completo de gestión IoT para dispositivos conectados a The Things Network

## 📋 Descripción

TTN Management System es una aplicación web moderna desarrollada con React y TypeScript que permite gestionar y monitorear dispositivos IoT conectados a The Things Network (TTN). La plataforma ofrece visualización de datos en tiempo real, mapas interactivos, y análisis avanzados de métricas de sensores.

## ✨ Características Principales

- **🗺️ Mapas Interactivos**: Visualización geográfica de dispositivos IoT usando Mapbox
- **📊 Dashboard de Métricas**: Gráficos en tiempo real con Recharts
- **🔍 Gestión de Dispositivos**: CRUD completo para dispositivos TTN
- **📱 Diseño Responsivo**: Interfaz adaptativa para todos los dispositivos
- **🎨 UI Moderna**: Componentes con Radix UI y Tailwind CSS
- **⚡ Rendimiento Optimizado**: Aplicación SPA con React 18

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.3.1** - Biblioteca principal
- **TypeScript** - Tipado estático
- **React Router DOM** - Navegación SPA
- **Tailwind CSS** - Framework de estilos

### Componentes UI
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconografía moderna
- **React Tooltip** - Tooltips interactivos

### Visualización de Datos
- **Recharts** - Gráficos y estadísticas
- **Mapbox GL** - Mapas interactivos
- **React Map GL** - Integración React-Mapbox

### Herramientas de Desarrollo
- **Create React App** - Configuración base
- **ESLint** - Linting de código
- **Jest** - Testing framework

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Cuenta de Mapbox (para mapas)
- Acceso a The Things Network

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Yop007N/ttngestion.git
cd ttngestion

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar en modo desarrollo
npm start
```

### Variables de Entorno

```env
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
REACT_APP_TTN_API_KEY=your_ttn_api_key
REACT_APP_TTN_APPLICATION_ID=your_application_id
```

## 📖 Scripts Disponibles

```bash
# Desarrollo
npm start          # Inicia el servidor de desarrollo (puerto 3000)

# Construcción
npm run build      # Construye la app para producción

# Testing
npm test           # Ejecuta los tests en modo watch

# Análisis
npm run eject      # Extrae la configuración (irreversible)
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes UI base
│   ├── maps/            # Componentes de mapas
│   └── charts/          # Componentes de gráficos
├── pages/               # Páginas principales
├── hooks/               # Hooks personalizados
├── utils/               # Utilidades y helpers
├── types/               # Tipos TypeScript
├── styles/              # Estilos globales
└── api/                 # Servicios de API
```

## 🔧 Configuración de Desarrollo

### Mapbox Setup
1. Crea una cuenta en [Mapbox](https://www.mapbox.com/)
2. Obtén tu token de acceso
3. Agrégalo a tu archivo `.env`

### TTN Integration
1. Configura tu aplicación en TTN Console
2. Obtén las credenciales de API
3. Configura los webhooks necesarios

## 📊 Funcionalidades

### Dashboard Principal
- Resumen de dispositivos activos
- Métricas en tiempo real
- Alertas y notificaciones

### Gestión de Dispositivos
- Lista de dispositivos registrados
- Detalles y configuración
- Historial de datos

### Visualización de Mapas
- Ubicación de dispositivos
- Estado en tiempo real
- Clustering inteligente

### Analytics
- Gráficos de tendencias
- Reportes personalizados
- Exportación de datos

## 🌐 Despliegue

### Build de Producción
```bash
npm run build
```

### Servicios Recomendados
- **Vercel** - Despliegue automático
- **Netlify** - Hosting estático
- **Firebase Hosting** - Google Cloud

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Enrique B. (Yop007N)**
- GitHub: [@Yop007N](https://github.com/Yop007N)
- Especialización: IoT y Eficiencia Energética

## 🔗 Enlaces Relacionados

- [The Things Network](https://www.thethingsnetwork.org/)
- [Mapbox Documentation](https://docs.mapbox.com/)
- [React Documentation](https://reactjs.org/)

---

⭐ Si este proyecto te ha sido útil, no olvides darle una estrella en GitHub!