# Proyecto PrimeNG19 Base

Creación y Configuración Base de Proyecto de Angular19 con PrimeNG, PrimeFlex, PrimeIcons y TailwindCSS

## 1. Cambiar a un Node.js compatible

Angular 19 soporta Node 22. Lo más sencillo es usar **nvm** (Node Version Manager).

```bash

# cierra y vuelve a abrir tu terminal, luego:
nvm install 22              # instala la última Node 22
nvm use 22                  # usa Node 22 en esta sesión
nvm alias default 22        # OPCIONAL: haz de Node 22 tu versión por defecto
```

Verifica:

```bash
node -v    # debe mostrar v22.xx.x
npm -v     # vendrá emparejado con esa versión
```

---

## 2. Instalar Angular CLI v19

Desinstala cualquier CLI global de Angular 19 y pon la versión 18:

```bash
npm uninstall -g @angular/cli
npm install -g @angular/cli@19
ng version   # debe mostrar Angular CLI: 19.x.x
```

---

## 3. Crear tu proyecto Angular 18

Ya con la CLI correcta, genera tu aplicación:

```bash
ng new mi-proyecto
```

Durante el wizard:

- ✔️ **Which stylesheet format?** → SCSS
- **Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)?** (y/N) -> NO

Esto te deja un paquete base con Angular 19 y TypeScript 5.x compatibles.

### 3.1. Usar Git

Por defecto se crean archivos y se inicializa el repo local. Pero es recomendable crear ramas.

**Configurar las rutas de confianza**

```bash
git config --global --add safe.directory /ruta/a/tu/Proyecto/mi-proyecto
```

**Entrar al proyecto y crear el initial commit**

```bash
cd mi-proyecto
git add .
git commit -m "first commit"
```

**Crear la rama main**

```bash
git branch -M main
```

**Agregar un Repositorio remoto \[OPCIONAL]**
Creamos un repo vació en GitHub y lo enlazamos al proyecto

```bash
git remote add origin git@github.com:usuario/RepoName.git
git push -u origin main
```

**Crear nuevas ramas \[OPCIONAL]**

```bash
git checkout -b development
git checkout -b feature_x
```

Personalmente trabajo una rama para Desarrollo donde se mantendran los cambios de varios programadores y cuando ya se considere completa una versión, se mueve a main (producción).

Es recomendable trabajar en una rama derivada de development donde se trabaja en un feature en específico y al terminar el feature hacer merge con development y eliminarla. Pero mas sin embargo, yo trabajo con una rama de usuario (mi nombre) nomas porque no me puedo organizar por features.

---

## 4. Añadir Dependencias

### 4.1 TailwindCSS

Ejecuta:

```bash
npm install tailwindcss @tailwindcss/postcss postcss --force
```

Crear el archivo`.postcssrc.json` en la raíz del proyecto y colocarle el plugin para Postcss`@tailwindcss/postcss`.

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

Agrega los `@use`al archivo `./src/styles.scss` que importa los estilos de tailwind

```js
@use "tailwindcss";
```

Para probarlo en el archivo `app.component.html` borramos el contenido y agregamos el siguiente codigo:

```html
<h1 class="text-3xl font-bold underline">Hello world!</h1>
```

### 4.2. PrimeNG PrimeIcons PrimeFlex

En el directorio de tu proyecto:

```bash
   npm install primeng @primeng/themes
   npm install primeflex
   npm install primeicons
```

### 4.2.1 Registrar estilos

En tu `styles.css` agrega:

```json
@use "primeicons/primeicons.css";
@use 'primeflex/primeflex.css'
```

Así aseguras que cargue primero PrimeFlex y los estilos de PrimeNG.

### 4.2.2 Importar módulo de PrimeNG

Agrega `providePrimeNG` y `provideAnimationsAsync` a la lista de providers en el archivo `app.config.ts` y utiliza la propeidad `theme` para configurar el tema. Por ejemplo Nora.

```ts
// esto va en los inports
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { providePrimeNG } from "primeng/config";
import Nora from "@primeng/themes/nora";
```

```typescript
//esto va en providers
provideAnimationsAsync(),
providePrimeNG({ theme: { preset: Nora, options: { darkModeSelector: '.app-dark' } } }),
```

Debería quedar algo así:

```ts
// Prime NG
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { providePrimeNG } from "primeng/config";
import Nora from "@primeng/themes/nora";

export const appConfig: ApplicationConfig = {
  providers: [provideAnimationsAsync(), providePrimeNG({ theme: { preset: Nora, options: { darkModeSelector: ".app-dark" } } }), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)],
};
```

Para probarlo agregar un botón a un componente:

```typescript
import { Component } from "@angular/core";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "button-demo",
  templateUrl: "./button-demo.html",
  standalone: true,
  imports: [ButtonModule],
})
export class ButtonDemo {}
```

```html
<div class="card flex justify-center">
  <p-button label="Check" />
</div>
```

# Agregar algo de SakaiNG

Sakai **NO ES UNA LIBRERÍA** ni un paquete, es un proyecto real hecho con la licencia MIT (para copiar a lo descarado) en el que se muestra los usos de PrimeNG puro.
SakaiNG utiliza SCSS para dar estilo a sus componentes, por lo que también hay que incluirlos ya que no usa tailwind directamente.

Esta es buena para sacar componentes específicos o ejemplos.

En mi caso lo uso para el layout, viene con un chingo de cosas pero yo las resumí y ordené para tener solo lo que me importa.

Para copiarlo des este proyecto solo copia la carpeta `src/app/layout` y lo pegas en tu proyecto con la misma ruta.

Para que te funcionen bien tenes que agregar un `@use` a tu `src/styles.scss`:

```scss
@use "./app/layout/styles/layout.scss";
```

Este proyecto cuenta con esta estructura de layout:

```
./src/app/layout/
├── components
│   ├── app.breadcrumb
│   │   ├── app.breadcrumb.html
│   │   └── app.breadcrumb.ts
│   ├── app.footer
│   │   ├── app.footer.html
│   │   └── app.footer.ts
│   ├── app.layout
│   │   ├── app.layout.html
│   │   └── app.layout.ts
│   ├── app.menu
│   │   ├── app.menu.html
│   │   └── app.menu.ts
│   ├── app.menuitem
│   │   ├── app.menuitem.html
│   │   └── app.menuitem.ts
│   ├── app.sidebar
│   │   ├── app.sidebar.html
│   │   └── app.sidebar.ts
│   └── app.topbar
│       ├── app.topbar.html
│       └── app.topbar.ts
├── service
│   └── layout.service.ts
└── styles
    ├── _core.scss
    ├── _footer.scss
    ├── layout.scss
    ├── _main.scss
    ├── _menu.scss
    ├── _mixins.scss
    ├── _preloading.scss
    ├── _responsive.scss
    ├── _topbar.scss
    ├── _typography.scss
    ├── _utils.scss
    └── variables
        ├── _common.scss
        ├── _dark.scss
        └── _light.scss

```

Esta estructura corresponde a un sistema de layout modular para una aplicación Angular, organizado en 3 secciones principales. Te explico cada parte:

### 1. **Components (Componentes de UI del Layout)**

Cada carpeta representa un componente visual del layout principal:

- **app.breadcrumb**: Componente para la navegación jerárquica (migas de pan)
- **app.footer**: Pie de página con información de copyright/links
- **app.layout**: Componente contenedor principal que ensambla todo el layout
- **app.menu**: Sistema de menú del sidebar. Contiene menuitems
- **app.menuitem**: Elemento individual del menú (con lógica de navegación)
- **app.sidebar**: Barra lateral colapsable/expandible
- **app.topbar**: Barra superior con logo, iconos de usuario y botones de acción

Cada componente tiene:

- `.html`: Template con estructura HTML
- `.ts`: Lógica de componente (props, métodos, estado)

Cada componente utiliza clases de scss que se definen en la carpeta `styles` del layout

### 2. **Service (Lógica de Negocio del Layout)**

- **layout.service.ts**: Servicio Angular que maneja:
  - Estado del sidebar (abierto/cerrado)
  - Gestión de temas (claro/oscuro)
  - Comunicación entre componentes del layout
  - Configuraciones persistentes (localStorage)
  - Eventos globales del layout

### 3. **Styles (Sistema de Estilos Modular)**

Sistema SCSS organizado en partials:

- **layout.scss**: Archivo principal que importa todos los partials
- **\_core.scss**: Estilos base y reset CSS
- **\_menu.scss**: Estilos específicos para menús y submenús
- **\_topbar.scss**: Diseño de la barra superior
- **\_footer.scss**: Estilos del pie de página
- **\_responsive.scss**: Media queries para diferentes dispositivos
- **\_mixins.scss**: Funciones reutilizables de SCSS
- **\_preloading.scss**: Animaciones de carga inicial
- **variables/**: Sistema de theming
  - **\_common.scss**: Variables compartidas (espaciados, bordes)
  - **\_light.scss**: Tema claro (colores, sombras)
  - **\_dark.scss**: Tema oscuro (alternativa de colores)

### Flujo de trabajo típico:

1. **app.layout.ts** importa todos los componentes visuales
2. El template **app.layout.html** estructura los componentes usando CSS Grid/Flexbox
3. **layout.service.ts** inyectado en componentes para:

   - Cambiar temas (light/dark)
   - Controlar visibilidad del sidebar
   - Gestionar estado responsive

4. Los estilos se compilan mediante **layout.scss** que importa todos los partials
