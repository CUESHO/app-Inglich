# Fast English - Aplicación Móvil

Esta es la aplicación móvil de **Fast English**, una plataforma gamificada para aprender inglés. Está construida con **React Native** y **Expo**, permitiendo un despliegue rápido en dispositivos Android e iOS.

## 📋 Requisitos Previos

- **Node.js** (v16 o superior)
- **npm** o **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Android Studio** (para emulador de Android) o un dispositivo Android físico
- **Xcode** (para iOS, solo en macOS)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/CUESHO/app-Inglich.git
cd app-Inglich/mobile-app
```

### 2. Instalar Dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto `mobile-app`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_OAUTH_PORTAL_URL=https://oauth.example.com
```

Reemplaza las URLs con las de tu servidor de backend.

## 📱 Ejecutar la Aplicación

### En Emulador de Android

```bash
npm run android
```

Esto abrirá el emulador de Android y ejecutará la aplicación.

### En Dispositivo Android Físico

1. Instala la aplicación **Expo Go** desde Google Play Store
2. Ejecuta:
   ```bash
   npm start
   ```
3. Escanea el código QR con tu dispositivo usando Expo Go

### En Emulador de iOS (solo macOS)

```bash
npm run ios
```

### En Web (para pruebas)

```bash
npm run web
```

## 🏗️ Estructura de Carpetas

```
mobile-app/
├── app/
│   ├── screens/              # Pantallas de la aplicación
│   │   └── HomeScreen.tsx
│   ├── components/           # Componentes reutilizables
│   ├── hooks/                # Custom hooks
│   ├── services/             # Servicios de API
│   │   └── api.ts
│   ├── store/                # Gestión de estado con Zustand
│   │   └── useGameStore.ts
│   ├── types/                # Tipos TypeScript
│   │   └── index.ts
│   └── utils/                # Funciones utilitarias
├── assets/                   # Imágenes y recursos
├── app.json                  # Configuración de Expo
├── package.json              # Dependencias del proyecto
└── tsconfig.json             # Configuración de TypeScript
```

## 🔧 Tecnologías Utilizadas

- **React Native**: Framework para aplicaciones móviles
- **Expo**: Plataforma para construir aplicaciones React Native
- **TypeScript**: Lenguaje de programación tipado
- **Zustand**: Gestión de estado ligera
- **Axios**: Cliente HTTP para comunicación con el backend
- **tRPC**: RPC type-safe para comunicación cliente-servidor
- **React Query**: Gestión de datos asincronos

## 📚 Características Principales

- ✅ Interfaz adaptada para pantallas táctiles
- ✅ Navegación intuitiva entre mundos y misiones
- ✅ Sistema de gamificación (XP, monedas, niveles)
- ✅ Sincronización en tiempo real con el backend
- ✅ Autenticación segura con OAuth 2.0
- ✅ Persistencia de datos local

## 🔐 Autenticación

La aplicación utiliza OAuth 2.0 para la autenticación. Asegúrate de configurar correctamente las URLs de OAuth en el archivo `.env.local`.

## 🚢 Compilación para Producción

### Generar APK para Android

```bash
eas build --platform android
```

### Generar IPA para iOS

```bash
eas build --platform ios
```

Requiere tener configurada una cuenta en **Expo Application Services (EAS)**.

## 📦 Publicar en Google Play Store

1. Crea una cuenta de desarrollador en Google Play Console
2. Genera un APK o AAB usando EAS Build
3. Sube el archivo a Google Play Console
4. Completa la información de la aplicación y envía para revisión

## 🐛 Solución de Problemas

### La aplicación no se conecta al backend

- Verifica que la URL en `.env.local` sea correcta
- Asegúrate de que el servidor backend esté corriendo
- Comprueba la conectividad de red del dispositivo

### Errores de compilación

```bash
# Limpiar caché
npm run reset-project

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Problemas con Expo

```bash
# Actualizar Expo CLI
npm install -g expo-cli@latest

# Limpiar caché de Expo
expo start --clear
```

## 📞 Soporte

Para reportar problemas o sugerencias, abre un issue en el repositorio de GitHub.

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.
