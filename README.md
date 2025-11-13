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
- Standalone Components
- Angular Router
- CSS responsivo / estilos personalizados
- Servicios simulados (mock data)
- LocalStorage para manejo básico de sesión

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
