# 🍦 Meriloops Ice Cream Shop - Architecture and Specifications Document (EN)

## 1. General Objective
Design a web application to record ingredients, calculate the real cost of each ice cream, define selling prices, and determine product profitability. The application will first work with **Local Storage** to facilitate offline use and, optionally, can be synchronized with **Supabase** as a cloud database.

## 2. Main Functionality
- **Ingredient Registration:** Name, unit, purchased quantity, total cost, and unit cost.
- **Recipe Creation:** By product or flavor, selecting ingredients and quantities used.
- **Cost Calculation:** Automatic calculation per recipe (total) and per portion or unit.
- **Indirect Expenses Management:** Rent, electricity, water, labor, advertising, and waste.
- **Pricing and Profitability:** Definition of selling price per product and calculation of utility, margin, and total profit.
- **Results Panel (Dashboard):** Quick identification of whether the current price generates profit or loss.
- **Persistence:** Local storage in `localStorage` for offline use. Optional synchronization with Supabase for backup and multi-device access.

## 3. Technology Stack
| Layer | Suggested Technology | Use |
| :--- | :--- | :--- |
| **Frontend** | HTML, CSS and JavaScript (Vanilla) or React | User interface and calculation logic |
| **Styling** | Traditional CSS / Modular CSS | **RESTRICTION: Do not use Tailwind CSS.** |
| **Local Persistence** | Local Storage | Save data offline |
| **Backend (Optional)** | Supabase | Cloud database and authentication |
| **Database** | PostgreSQL (in Supabase) | Remote storage of records |
| **Synchronization** | Supabase API | Send and retrieve data from the cloud |

## 4. System Characteristics
- **UX/UI:** Simple, intuitive, and easy-to-use design for the ice cream shop staff. Designed with a **Mobile First** approach ensuring full usability on mobile devices.
- **Automation:** Automatic cost calculation without the need for manual formulas from the user.
- **Specific Business Rules:** Support for water as a main ingredient and exclusion of gas in the calculations for certain products.
- **Metrics:** Clear view of profitability per product.
- **Offline-First:** Guaranteed offline mode thanks to local persistence.
- **Scalability:** Prepared for adding future reports, PDF/Excel export, and authentication.

## 5. Minimum Screen Structure
1. **General Dashboard:** Summary of costs, profits, and key metrics.
2. **Ingredients Screen:** CRUD (Create, Read, Update, Delete) of raw materials.
3. **Recipes Screen:** Assembly of products based on ingredients.
4. **Pricing Calculation Screen:** Simulation and definition of selling prices.
5. **Reports and Utilities Screen:** Detailed view of profitability.

## 6. Conclusion
This solution allows starting quickly, economically, and robustly with local storage. As the business grows or requires multi-device support, the migration or synchronization to Supabase will be transparent without needing to rebuild the application. It is a solid foundation to control costs, set prices, and ensure the profitability of the ice cream shop.

---

# 🍦 Heladería Meriloops - Documento de Arquitectura y Especificaciones (ES)

## 1. Objetivo General
Diseñar una aplicación web para registrar insumos, calcular el costo real de cada helado, definir precios de venta y determinar la rentabilidad del producto. La aplicación funcionará primero con **Local Storage** para facilitar el uso offline y, de forma opcional, podrá sincronizarse con **Supabase** como base de datos en la nube.

## 2. Funcionalidad Principal
- **Registro de insumos:** Nombre, unidad, cantidad comprada, costo total y costo unitario.
- **Creación de recetas:** Por producto o sabor, con selección de insumos y cantidades utilizadas.
- **Cálculo de costos:** Automático por receta (total) y por porción o unidad.
- **Gestión de gastos indirectos:** Renta, luz, agua, mano de obra, publicidad y mermas.
- **Precios y rentabilidad:** Definición de precio de venta por producto y cálculo de utilidad, margen y ganancia total.
- **Panel de resultados (Dashboard):** Identificación rápida de si el precio actual genera ganancias o pérdidas.
- **Persistencia:** Almacenamiento local en `localStorage` para uso sin conexión. Sincronización opcional con Supabase para respaldo y acceso multi-dispositivo.

## 3. Stack Tecnológico
| Capa | Tecnología sugerida | Uso |
| :--- | :--- | :--- |
| **Frontend** | HTML, CSS y JavaScript (Vanilla) o React | Interfaz de usuario y lógica de cálculo |
| **Estilos** | CSS Tradicional / CSS Modular | **RESTRICCIÓN: No usar Tailwind CSS.** |
| **Persistencia Local** | Local Storage | Guardar datos sin conexión |
| **Backend (Opcional)** | Supabase | Base de datos en la nube y autenticación |
| **Base de Datos** | PostgreSQL (en Supabase) | Almacenamiento remoto de registros |
| **Sincronización** | API de Supabase | Enviar y recuperar datos desde la nube |

## 4. Características del Sistema
- **UX/UI:** Diseño simple, intuitivo y fácil de usar para el personal de la heladería. Construido con un enfoque **Mobile First** garantizando total usabilidad en dispositivos móviles.
- **Automatización:** Cálculo automático de costos sin necesidad de fórmulas manuales por parte del usuario.
- **Reglas de Negocio Específicas:** Soporte para el agua como insumo principal y exclusión de gas en los cálculos de ciertos productos.
- **Métricas:** Vista clara de rentabilidad por producto.
- **Offline-First:** Modo sin conexión garantizado gracias a la persistencia local.
- **Escalabilidad:** Preparado para agregar reportes futuros, exportación a PDF/Excel y autenticación.

## 5. Estructura Mínima de Pantallas
1. **Dashboard General:** Resumen de costos, ganancias y métricas clave.
2. **Pantalla de Insumos:** ABM (Alta, Baja, Modificación) de materias primas.
3. **Pantalla de Recetas:** Armado de productos en base a insumos.
4. **Pantalla de Cálculo de Precios:** Simulación y definición de precios de venta.
5. **Pantalla de Reportes y Utilidades:** Vista detallada de rentabilidad.

## 6. Conclusión
Esta solución permite comenzar de forma rápida, económica y robusta con almacenamiento local. A medida que el negocio crezca o requiera multi-dispositivo, la migración o sincronización hacia Supabase se realizará de forma transparente y sin necesidad de rehacer la aplicación. Es una base sólida para controlar costos, fijar precios y asegurar la rentabilidad de la heladería.