1. Propósito del Proyecto

El objetivo es soportar una plataforma de venta de paquetes turísticos flexibles (vuelos, hoteles, alquileres y actividades). La base de datos está diseñada sobre PostgreSQL 16 y es compatible con múltiples entornos de hosting, incluyendo Supabase.

2. Arquitectura y Organización (Los 5 Dominios)
Identidad y Preferencias: Gestiona usuarios (users), las respuestas a su cuestionario inicial (user_preferences) y el historial de sesiones del cuestionario (questionnaire_sessions).  
Catálogo de Componentes: El inventario independiente de productos: destinos (destinations), vuelos (flights), hoteles (hotels), vehículos/alquileres (rentals) y actividades/tours (activities).  
Paquetes Turísticos: Define el paquete general (packages) y utiliza una tabla intermedia polimórfica (package_items) para enlazar cualquier combinación de los componentes anteriores en un itinerario por días.  
Transacciones Comerciales: Controla el ciclo de vida de las reservas (bookings), los datos de cada pasajero para los pasajes (booking_travelers) y los intentos de pago (payments).  
Recomendaciones y Valoraciones: Registra el feedback del usuario (reviews) y los paquetes sugeridos de forma personalizada (recommendations) con su respectivo puntaje de afinidad.  

3. Decisiones Clave de Diseño (Lo Esencial)
Identificadores UUID v4: Todas las claves primarias utilizan la extensión uuid-ossp en lugar de IDs secuenciales numéricos, mejorando la seguridad y escalabilidad.  
Manejo de Monedas en Enteros: Para evitar errores de redondeo de punto flotante en Postgres, todos los precios se guardan en la unidad mínima de la moneda (ej. centavos para USD/EUR). Un precio de $150.00 se almacena como 15000.  
Relación Polimórfica Inteligente: La tabla package_items conecta un paquete con un vuelo, un hotel o una actividad usando un par de campos (item_type + item_id). Esto permite agregar nuevos tipos de productos en el futuro sin alterar la estructura de la base de datos.  
Uso Eficiente de Arrays (varchar[]): Datos como etiquetas de destinos (tags) o comodidades de hoteles (amenities) se guardan en arreglos nativos de Postgres. Esto evita crear tablas intermedias innecesarias y se consulta rápido gracias a índices GIN.  
Historial en JSONB: Las respuestas del cuestionario se guardan como un snapshot en formato JSONB dentro de questionnaire_sessions para auditar cómo cambian los gustos del usuario en el tiempo.  
Borrado Lógico (Soft Delete): Los productos del catálogo no se borran físicamente; se desactivan usando campos como is_active o status para no romper el historial de compras viejas.  

4. Seguridad y Automatización
Seguridad Portable (Row Level Security - RLS)
Todas las tablas tienen activado RLS. Lo interesante es que para hacer el sistema portable (independiente de Supabase), se creó la función current_app_user(), que lee una variable de sesión (app.current_user_id) que el backend inyecta en cada transacción.  
Datos Públicos: El catálogo (hoteles, destinos, paquetes) permite SELECT para cualquiera (siempre que estén activos).  
Datos Privados: Perfiles, reservas y pagos están restringidos estrictamente: el usuario solo puede ver y editar lo que le pertenece (user_id = current_app_user()).  

Triggers (Procesos Automáticos)
La base de datos se encarga por sí misma de:
Mantener fechas de actualización: Actualiza updated_at antes de modificar un usuario, paquete o reserva.  
Calcular calificaciones: Cada vez que se añade, edita o elimina una reseña (reviews), un trigger recalcula automáticamente el promedio (rating_avg) y total de votos (rating_count) en la tabla de packages.  

5. Optimización e Índices

Se crearon índices específicos para que las búsquedas más comunes de la app vuelen:  
Índices BTREE para logins (email), rutas de vuelos y filtros por precio o categorías.
Índices GIN para filtrar colecciones (como buscar paquetes que tengan los tags ['beach', 'adventure']).  
Extensión pg_trgm para activar búsqueda fuzzy (aproximada) sobre los nombres de los destinos, tolerando pequeños errores de escritura del usuario.  