# Estructura del Proyecto Fast English

## Descripción General

**Fast English** es una plataforma de aprendizaje de inglés gamificada construida con **React + TypeScript** en el frontend y **Node.js + Express** en el backend. La arquitectura está diseñada para ser escalable, mantenible y fácil de adaptar a una aplicación móvil Android.

---

## Estructura de Carpetas

```
Fast-English/
├── client/                          # Frontend React + Vite
│   ├── src/
│   │   ├── pages/                   # Páginas principales
│   │   │   ├── Home.tsx             # Página de inicio (login y selección de mundos)
│   │   │   ├── World.tsx            # Página de un mundo específico
│   │   │   ├── Mission.tsx          # Página de una misión
│   │   │   └── Shop.tsx             # Tienda de compras
│   │   ├── components/              # Componentes reutilizables
│   │   │   ├── ui/                  # Componentes de UI (Button, Card, Badge, etc.)
│   │   │   ├── DailyStreakWidget.tsx# Widget de racha diaria
│   │   │   └── [otros componentes]
│   │   ├── _core/                   # Lógica central
│   │   │   ├── hooks/               # Custom hooks
│   │   │   │   └── useAuth.ts       # Hook de autenticación
│   │   │   └── [otros]
│   │   ├── lib/                     # Utilidades y librerías
│   │   │   ├── trpc.ts              # Cliente tRPC para API
│   │   │   └── [otros]
│   │   ├── const.ts                 # Constantes (URLs, configuración)
│   │   ├── index.css                # Estilos globales
│   │   ├── main.tsx                 # Punto de entrada
│   │   └── App.tsx                  # Componente raíz
│   ├── index.html                   # HTML principal
│   ├── package.json                 # Dependencias del frontend
│   └── vite.config.ts               # Configuración de Vite
│
├── server/                          # Backend Node.js + Express
│   ├── _core/                       # Lógica central
│   │   ├── env.ts                   # Variables de entorno
│   │   ├── index.ts                 # Punto de entrada del servidor
│   │   └── [otros]
│   ├── routes/                      # Rutas de API
│   │   ├── progress.ts              # Rutas de progreso del usuario
│   │   ├── missions.ts              # Rutas de misiones
│   │   └── [otros]
│   ├── db.ts                        # Configuración de base de datos (Drizzle ORM)
│   └── [otros archivos]
│
├── shared/                          # Código compartido (tipos, constantes)
│   ├── worlds.ts                    # Definición de mundos
│   ├── missions.ts                  # Definición de misiones
│   └── [otros]
│
├── package.json                     # Dependencias del proyecto
├── tsconfig.json                    # Configuración de TypeScript
├── README.md                        # Documentación del proyecto
└── [otros archivos de configuración]
```

---

## Descripción de Componentes Principales

### 1. **Frontend (client/)**

#### Páginas Principales:
- **Home.tsx**: Página de inicio con login y selección de mundos
  - Muestra el título "Fast English"
  - Botones de idioma (Inglés/Español)
  - Estadísticas del usuario (nivel, XP, monedas, logros)
  - Grid de mundos disponibles

- **World.tsx**: Página de un mundo específico
  - Lista de misiones del mundo
  - Progreso del usuario en el mundo
  - Botones para iniciar misiones

- **Mission.tsx**: Página de una misión
  - Contenido interactivo de la misión
  - Minijuegos y ejercicios
  - Sistema de recompensas (XP, monedas)

- **Shop.tsx**: Tienda de compras
  - Items disponibles para comprar
  - Carrito de compras
  - Sistema de pago

#### Componentes Reutilizables:
- **Button**: Botón personalizado con estilos de juego
- **Card**: Tarjeta para mostrar información
- **Badge**: Etiqueta para estados (desbloqueado, bloqueado, etc.)
- **Progress**: Barra de progreso (XP, misiones)
- **DailyStreakWidget**: Widget que muestra la racha diaria

#### Hooks Personalizados:
- **useAuth()**: Maneja la autenticación del usuario
  - Obtiene el usuario actual
  - Verifica si está autenticado
  - Maneja el estado de carga

#### Librerías Principales:
- **tRPC**: Para llamadas a la API del servidor
- **Wouter**: Router ligero para navegación
- **Lucide React**: Iconos SVG

### 2. **Backend (server/)**

#### Rutas de API (tRPC):
- **progress.getMyProgress()**: Obtiene el progreso del usuario
- **progress.unlockWorld()**: Desbloquea un mundo
- **progress.updateXP()**: Actualiza XP del usuario
- **missions.getMissions()**: Obtiene misiones de un mundo
- **missions.completeMission()**: Marca una misión como completada

#### Base de Datos:
- **Drizzle ORM**: ORM para MySQL/TiDB
- **Tablas principales**:
  - `users`: Información del usuario
  - `progress`: Progreso del usuario
  - `worlds`: Definición de mundos
  - `missions`: Definición de misiones
  - `achievements`: Logros del usuario

### 3. **Código Compartido (shared/)**

- **worlds.ts**: Define los 8 mundos del juego
  - Nombre, descripción, color, misiones
- **missions.ts**: Define las misiones de cada mundo
  - Tipo de misión, dificultad, recompensas

---

## Flujo de Datos

```
Usuario → Frontend (React) → tRPC Client → Backend (Express) → Base de Datos
                                ↓
                         Validación & Lógica
                                ↓
                           Respuesta JSON
                                ↓
                         Frontend actualiza UI
```

---

## Tecnologías Utilizadas

| Capa | Tecnología | Propósito |
|------|-----------|----------|
| Frontend | React 18 | Framework UI |
| Frontend | TypeScript | Tipado estático |
| Frontend | Vite | Bundler rápido |
| Frontend | Tailwind CSS | Estilos |
| Frontend | tRPC | API type-safe |
| Backend | Node.js | Runtime |
| Backend | Express | Framework web |
| Backend | TypeScript | Tipado estático |
| Base de Datos | MySQL/TiDB | Base de datos |
| ORM | Drizzle | Acceso a BD |
| Auth | OAuth 2.0 | Autenticación |

---

## Cómo Modificar Cada Parte

### Cambiar Colores
1. Editar `/client/src/index.css`
2. Modificar las variables CSS en la sección `--color-*`
3. Los cambios se aplicarán automáticamente a toda la UI

### Agregar una Nueva Página
1. Crear archivo en `/client/src/pages/NuevaPagina.tsx`
2. Importar en `/client/src/App.tsx`
3. Agregar ruta en el router

### Agregar una Nueva Ruta de API
1. Crear archivo en `/server/routes/nueva-ruta.ts`
2. Definir el router con tRPC
3. Exportar en `/server/_core/index.ts`
4. Usar en el frontend con `trpc.nuevaRuta.metodo.useQuery()`

### Cambiar Mundos o Misiones
1. Editar `/shared/worlds.ts` y `/shared/missions.ts`
2. Los cambios se reflejarán automáticamente en la UI

---

## Variables de Entorno

### Frontend (.env.local)
```
VITE_OAUTH_PORTAL_URL=http://localhost:3000
```

### Backend (.env)
```
DATABASE_URL=mysql://user:password@localhost:3306/inglich_db
JWT_SECRET=tu_secreto_jwt
OAUTH_SERVER_URL=http://localhost:3000
PORT=3000
```

---

## Comandos Útiles

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Ejecutar migraciones de BD
pnpm db:migrate

# Ver la BD
pnpm db:studio
```

---

## Próximos Pasos para Android

Para convertir esta aplicación a una app de Android:

1. **React Native**: Usar Expo + React Native para compartir código
2. **Alternativa**: Usar Flutter o Kotlin nativo
3. **Estructura de carpetas para Android**:
   ```
   mobile/
   ├── android/          # Código nativo Android
   ├── src/              # Código compartido (React Native)
   └── assets/           # Imágenes y recursos
   ```

---

## Notas Importantes

- La aplicación está optimizada para ser responsive (móvil, tablet, desktop)
- Usa Tailwind CSS para estilos responsivos
- El código está tipado con TypeScript para mayor seguridad
- Las llamadas a API son type-safe gracias a tRPC
- La autenticación se maneja con OAuth 2.0

