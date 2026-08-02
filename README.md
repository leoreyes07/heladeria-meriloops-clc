# Scoop Ledger 🍦

> **Operational manager and profitability analysis tool for artisanal creameries.**
> 
> *[Leer en Español](#-español)*

Scoop Ledger is a comprehensive platform designed specifically for artisanal ice cream shops. It allows you to manage ingredient inventory, formulate recipes, accurately calculate profitability, and receive smart alerts about costs.

## 🚀 Key Features

- **Global Dashboard**: Quick overview of inventory and operations status.
- **Ingredient Management (Inventory)**: Detailed control of supplies, unit costs, and waste.
- **Recipe Formulation**: Flavor creation with automatic cost calculation based on inventory.
- **Profitability Analysis (Pricing)**: Profit margin projection and pricing suggestions.
- **AI Advisory**: Smart alerts and recommendations on cost optimization and supply chain.
- **Order Management (Orders)**: Control of production and wholesale tub orders.

## 🛠️ Tech Stack

- **Core**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Animations**: Motion
- **AI**: Google GenAI SDK (Gemini Integration)

## ⚙️ Installation & Setup

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (version 20+ recommended)

### 2. Installation

Install the project dependencies:

```bash
npm install
```

### 3. Environment Variables

Rename or copy the `.env.example` file to `.env.local` and set your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Run Development Server

Start the local server with Vite:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Architecture (Container-Presentational Pattern)

The project is designed with a strict separation of concerns, fundamental for clean and scalable code:
- `src/App.tsx`: Main container handling global state and business logic.
- `src/components/`: Isolated presentational components (views, modals, navbars).
- `src/data/`: Initial mock data for app hydration.
- `src/types.ts`: Strict TypeScript domain model definitions.

---

# 🇪🇸 Español

Scoop Ledger es una plataforma integral diseñada específicamente para heladerías artesanales. Permite gestionar el inventario de ingredientes, formular recetas, calcular rentabilidades con precisión y recibir alertas inteligentes sobre costos.

## 🚀 Características Principales

- **Dashboard General**: Visión rápida del estado de inventarios y operaciones.
- **Gestión de Ingredientes (Inventory)**: Control detallado de insumos, costos por unidad y mermas.
- **Formulación de Recetas**: Creación de sabores con cálculo automático de costos basados en el inventario.
- **Análisis de Rentabilidad (Pricing)**: Proyección de márgenes de ganancia y sugerencias de precios.
- **Asesor IA (AI Advisory)**: Alertas y recomendaciones inteligentes sobre optimización de costos y cadena de suministro.
- **Gestión de Pedidos (Orders)**: Control de producción y pedidos mayoristas.

## 🛠️ Tecnologías Utilizadas

- **Core**: React 19 + TypeScript + Vite
- **Estilos**: Tailwind CSS 4
- **Íconos**: Lucide React
- **Animaciones**: Motion
- **IA**: Google GenAI SDK (Integración Gemini)

## ⚙️ Instalación y Configuración

### 1. Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 20+ recomendada)

### 2. Instalación

Instala las dependencias del proyecto:

```bash
npm install
```

### 3. Variables de Entorno

Renombra o copia el archivo `.env.example` a `.env.local` y configura tu clave de API de Gemini:

```env
GEMINI_API_KEY=tu_clave_api_aqui
```

### 4. Ejecutar en Desarrollo

Levanta el servidor local con Vite:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 🏗️ Arquitectura (Patrón Container-Presentational)

El proyecto está diseñado buscando la separación de responsabilidades, fundamental para mantener el código limpio y escalable:
- `src/App.tsx`: Contenedor principal que maneja el estado global y la lógica de negocio.
- `src/components/`: Componentes presentacionales aislados (vistas, modales, barras de navegación).
- `src/data/`: Datos iniciales (mock data) para la inicialización de la app.
- `src/types.ts`: Definición estricta de los modelos de dominio.

---
*Desarrollado con pasión para llevar la gestión de heladerías artesanales al siguiente nivel.*
