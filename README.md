# Agenda ITESO

Proyecto desarrollado en Angular como parte del curso Desarrollo en el Cliente.  
La aplicación tiene como objetivo ofrecer una agenda digital para estudiantes del ITESO, donde puedan organizar clases, tareas y actividades en un mismo lugar.

Este repositorio incluye las vistas, rutas, componentes, servicios y directivas base necesarias para la navegación y diseño de la aplicación.  
En esta versión no existe conexión con API ni base de datos; los datos mostrados son estáticos y sirven únicamente para propósitos de demostración y diseño de interfaz.

## Cómo ejecutar el proyecto

Asegúrate de tener instalada una versión reciente de Node.js (>= 20.19 o >= 22.12) y Angular CLI.  
Luego ejecuta los siguientes comandos en la terminal:

```
npm install
npm start
```

Una vez iniciado, abre tu navegador en:  
http://localhost:4200  
La aplicación se recargará automáticamente al guardar cambios en los archivos fuente.

## Estructura general del proyecto

El proyecto está organizado en distintos módulos que permiten mantener el código limpio y modular:

| Carpeta / Módulo | Descripción |
|------------------|-------------|
| /layout | Contiene el encabezado y pie de página de la aplicación. |
| /pages | Páginas principales como Inicio, Login, Registro, Dashboard, Actividades, Plantillas y Notificaciones. |
| /shared | Servicios, directivas y tipos compartidos entre componentes. |
| /ui | Componentes visuales reutilizables (como el sistema de notificaciones). |

Cada vista utiliza ruteo interno para navegar entre secciones siguiendo estas rutas:

- `/` → Página de inicio (Landing)
- `/auth/login` → Inicio de sesión
- `/auth/register` → Registro de usuario
- `/app/dashboard` → Panel principal
- `/app/activities` → Listado de actividades
- `/app/activities/new` → Formulario de nueva actividad
- `/app/templates` → Plantillas de actividades
- `/app/notifications` → Ejemplos de mensajes y notificaciones

## Tecnologías utilizadas

- Angular 20 con TypeScript
- Firebase
- Standalone Components
- Angular Router
- SASS responsivo / estilos personalizados
- Servicios simulados (mock data)

## Autenticación con Firebase (Email/Password)

Esta versión integra autenticación con Firebase en el cliente (Email/Password) usando el SDK oficial modular. El sistema está configurado para funcionar en modo "client-only": el idToken se almacena en `localStorage` y la verificación de rutas se hace desde el cliente mediante el observable `authState$`.

## Resumen de la implementación

**Servicios principales:**
- `src/app/shared/services/firebaseAuth.ts` — Servicio principal de autenticación que expone `signIn`, `signUp`, `signOut`, `getIdToken` y un observable `authState$`. El SDK se carga con import dinámico para evitar problemas con SSR.
- `src/app/shared/services/firebaseClientInit.ts` — Inicialización de Firebase app y auth solo en el navegador.
- `src/app/shared/services/token.ts` — Mantiene el `token` en `localStorage` y expone `token$` (BehaviorSubject) para suscripciones reactivas.

**Configuración:**
- `src/app/shared/config/firebase.config.ts` — Contiene el `firebaseConfig` del proyecto.

**Guardias:**
- `src/app/shared/guards/authGuard.ts` — Protege rutas privadas (como `/app/dashboard`) verificando si el usuario tiene token válido. Redirige a `/auth/login` si no está autenticado.
- `src/app/shared/guards/guestGuard.ts` — Protege rutas de autenticación (como `/auth/login` y `/auth/register`) redirigiendo a `/app/dashboard` si el usuario ya está logueado.

**Directivas:**
- `src/app/shared/directives/authVisible.ts` — Directiva estructural para mostrar/ocultar elementos según el estado de autenticación:
  - `*appAuthVisible="'auth'"` → Solo visible para usuarios logueados
  - `*appAuthVisible="'guest'"` → Solo visible para usuarios NO logueados

## Requisitos y pasos para pruebas locales

1. **Configurar Firebase Console:**
   - Habilita Email/Password en Authentication → Sign-in method → Email/Password
   - Copia las credenciales de tu proyecto Firebase

2. **Configurar el proyecto:**
   - Crea `src/app/shared/config/firebase.config.ts` con tu configuración:
   ```typescript
   export const firebaseConfig = {
     apiKey: "tu-api-key",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto-id",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```
   **Este paso no es necesario ya que inlcuimos las de un integrante del equipo.**

## Flujo de autenticación (client-only)

1. **Registro:**
   - Usuario ingresa su email (prefijo antes de `@iteso.mx`) y contraseña
   - Se valida que el email sea institucional
   - `FirebaseAuthService.signUp()` crea el usuario en Firebase
   - El idToken se guarda en `localStorage` con `Token.setToken()`
   - Se marca el registro con `localStorage.setItem('welcome_pending_<uid>', '1')`
   - Redirección automática a `/app/dashboard`
   - Se muestra banner de bienvenida único con mensaje personalizado

2. **Inicio de sesión:**
   - Usuario ingresa credenciales institucionales
   - `FirebaseAuthService.signIn()` autentica con Firebase
   - El idToken se guarda localmente
   - Redirección automática a `/app/dashboard`
   - Se muestra mensaje "¡Bienvenido de vuelta, [Nombre]!"

3. **Protección de rutas:**
   - Rutas privadas (`/app/*`) verifican token con `authGuard`
   - Rutas de autenticación (`/auth/*`) verifican con `guestGuard` para evitar acceso si ya está logueado
   - Sin token válido → redirección a `/auth/login`
   - Con token válido intentando acceder a login/register → redirección a `/app/dashboard`

4. **Cierre de sesión:**
   - Botón "Cerrar sesión" llama a `FirebaseAuthService.signOut()`
   - Limpia el token local y actualiza `authState$`
   - Redirección automática a `/auth/login`


## Scripts útiles

| Comando | Descripción |
|----------|-------------|
| ng serve | Inicia el servidor de desarrollo. |
| ng build | Compila el proyecto para producción (carpeta /dist). |
| ng test | Ejecuta pruebas unitarias. |
| ng generate component <nombre> | Crea un nuevo componente Angular. |

## Notas

Este proyecto no incluye conexión a backend ni API.  
Toda la información mostrada (actividades, plantillas, mensajes, etc.) está hardcodeada únicamente para demostrar el diseño, navegación y arquitectura del lado del cliente.

## Sobre el proyecto

Agenda ITESO es una propuesta de agenda universitaria pensada para organizar actividades académicas, deportivas y personales dentro del entorno del ITESO.  
El proyecto forma parte de una entrega académica y se centra en el diseño, estructura y navegación del cliente.
