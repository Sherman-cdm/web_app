# Plan de backend y base de datos

Fecha: 5 de octubre de 2026. Estado: propuesta técnica basada en el código actual; implementación pendiente.

## Objetivo y alcance

Convertir el portal de demostración en un sistema centralizado de turnos y recepción, conservando la interfaz React existente. Primera entrega: usuarios, pacientes, profesionales, especialidades, agendas, bloqueos, reservas y auditoría. Estudios requieren una fase posterior con permisos específicos; no se asume que este proyecto sea una historia clínica electrónica.

## Situación comprobada

- `src/infrastructure/storage/hospitalRepository.ts` guarda el estado completo en localStorage. Sus bloqueos de escritura coordinan navegadores compatibles dentro del mismo origen y dispositivo; no coordinan computadoras diferentes.
- `src/services/authService.ts` autentica cuentas de demostración y pacientes locales, y reconstruye sesiones desde sessionStorage. Los permisos actuales no constituyen una barrera en un servidor.
- `src/services/api.ts` obtiene todos los turnos y busca estudios por DNI. En el backend estos accesos deben restringirse por identidad y hospital; conocer un DNI no autoriza a consultar datos.
- `src/domain/availability.ts` calcula disponibilidad y solapamientos en el cliente. Esta validación debe ejecutarse también en el servidor y complementarse con restricciones de base de datos.
- `src/domain/audit.ts` utiliza nombres genéricos de actor. El servidor deberá registrar el usuario autenticado.
- Hay estados históricos `rejected`; retirar el botón no elimina esos datos. Se conservarán como legado, sin ofrecer nuevas transiciones a rechazado.

## Arquitectura propuesta

React existente → API HTTP `/api/v1` en Node.js LTS y TypeScript → PostgreSQL.

Backend independiente en `Mi salud/backend/`, separado del servidor del analizador web de la carpeta superior. Propuesta: Express, acceso parametrizado mediante `pg` y migraciones SQL versionadas. Confirmar versiones compatibles y mantenidas al instalar; fijarlas en el lockfile. No se necesita reescribir la interfaz ni migrarla a Next.js.

Desarrollo local con datos ficticios, configuración por variables de entorno y PostgreSQL local o en contenedor. Frontend y API bajo el mismo origen en producción para simplificar cookies y conexiones. Credenciales de base de datos exclusivamente en el servidor.

La ubicación definitiva queda pendiente: servidor del hospital o infraestructura externa. La primera fase no depende de contratar un proveedor. No se implementará reserva offline: ante pérdida de conexión, mostrar el error y evitar confirmar una reserva que no fue guardada.

## Modelo de datos inicial

| Tabla | Responsabilidad y restricciones |
| --- | --- |
| hospitals | Identidad del hospital y zona horaria IANA; inicialmente America/Argentina/Buenos_Aires. |
| users | Identidad de acceso, hash de contraseña, estado activo; sin contraseñas en texto plano. |
| user_hospital_roles | Vinculación de usuario con hospital y rol; combinación única. |
| sessions | Sesiones revocables, vencimiento y token almacenado como hash. |
| patients | Identidad del paciente, tipo/número/país del documento y contacto; identificador interno independiente del DNI. Definir identificación de pacientes sin DNI antes del piloto. |
| patient_users | Vinculación verificada entre cuenta del portal y paciente. |
| specialties | Especialidades por hospital; estado activo. |
| professionals | Profesional, matrícula y contacto. |
| professional_hospitals | Vinculación del profesional con cada hospital. |
| professional_specialties | Especialidades habilitadas por profesional y hospital. |
| agendas | Profesional, hospital, especialidad, consultorio, vigencia, horario y duración del cupo. |
| agenda_days | Días de la semana habilitados; convención explícita compatible con el cliente. |
| agenda_blocks | Bloqueos por hospital y opcionalmente profesional; fechas y motivo. |
| appointments | Paciente, hospital, agenda, profesional, especialidad, inicio/fin, estado, origen, motivo, versión y fechas de creación/modificación. |
| appointment_events | Historial de estados y reprogramaciones con actor y motivo. |
| audit_events | Registro de operaciones sensibles con usuario real y hospital; escritura restringida. |
| hospital_settings | Configuración por hospital, incluida aprobación automática. |
| idempotency_keys | Claves de solicitudes repetidas, usuario, operación, hash del cuerpo, resultado y vencimiento. |

Claves foráneas y validaciones deben impedir referencias cruzadas inválidas entre hospitales, agendas, profesionales y especialidades. Desactivar catálogos usados por turnos en lugar de borrar registros vinculados. Guardar instantes como timestamptz y fechas/horarios de agendas en la zona del hospital; el servidor determina qué significa hoy.

Mantener una instantánea de los datos de contacto usados en la reserva cuando sea necesario para el historial, con una política explícita de conservación. No duplicar contraseñas ni resultados médicos en auditorías o logs.

## Integridad de las reservas

1. La API identifica al usuario y obtiene sus permisos; no confía en el rol, paciente ni hospital enviados por el cliente.
2. Dentro de una transacción verifica agenda, profesional, especialidad, bloqueos, horario futuro y duración.
3. Una restricción de exclusión PostgreSQL con `btree_gist` impide solapamientos sobre el rango `[inicio, fin)` para el mismo profesional, incluso entre hospitales. Una restricción de horario exacto no alcanza cuando hay duraciones diferentes.
4. Preservar inicialmente la semántica actual: `pending`, `confirmed`, `arrived` y `completed` ocupan el intervalo; `cancelled`, `rejected` y `no_show` no lo ocupan. Los completados mantienen el historial de ocupación.
5. Reservar y modificar agendas/bloqueos deben compartir un protocolo de bloqueo transaccional por profesional. Un cambio de agenda con turnos afectados devuelve conflicto y requiere resolución explícita.
6. Reprogramar libera el horario anterior y reserva el nuevo en una sola transacción; si falla, se conserva la reserva original.
7. Cambiar estados usa versión esperada para evitar sobrescribir cambios de otro operador. La auditoría se escribe en la misma transacción.
8. Solicitudes repetidas con la misma clave de idempotencia no crean dos turnos. Misma clave con otro contenido devuelve conflicto.

Errores: 400 validación, 401 sesión ausente, 403 sin permiso, 404 recurso no accesible, 409 cupo ocupado o versión desactualizada, 429 exceso de solicitudes y 500 error interno sin datos sensibles. Respuesta estructurada con código estable, mensaje y requestId.

## Acceso y seguridad

Roles propuestos: paciente, recepción, profesional y administración. El rol actual `medical` debe sustituirse o mapearse de forma explícita; no convertir todas las cuentas médicas en administradores.

- Paciente: solo sus turnos y datos; crear/cancelar según reglas.
- Recepción: gestionar turnos y datos administrativos del hospital asignado; sin acceso automático a resultados médicos.
- Profesional: agenda propia y registros habilitados para su función.
- Administración: usuarios y configuración del hospital, sin acceso clínico implícito.

Contraseñas con hash adecuado (propuesta Argon2id), cookies HttpOnly/Secure/SameSite, protección CSRF para escrituras, revocación de sesiones, límites de intentos de acceso y validación de entrada. HTTPS en producción. Auditoría de exportaciones y operaciones sensibles. Separar usuario de migraciones y usuario de ejecución de la base de datos.

Definir con el hospital quién puede crear cuentas del personal, verificar identidad de pacientes, recuperar accesos y habilitar MFA para personal privilegiado. Las cuentas demo y los datos ficticios se excluyen de producción.

## Contrato inicial de API

| Grupo | Rutas propuestas |
| --- | --- |
| Sesión | POST /auth/login, POST /auth/logout, GET /auth/me |
| Registro | POST /auth/register; recuperación/verificación antes del piloto |
| Catálogos | GET /hospitals, GET /hospitals/:id/specialties |
| Disponibilidad | GET /hospitals/:id/slots con especialidad, fecha y profesional opcional |
| Paciente | GET /me/appointments, POST /me/appointments, POST /me/appointments/:id/cancel |
| Recepción | GET /hospitals/:id/appointments, POST /hospitals/:id/appointments |
| Cambios | POST /hospitals/:id/appointments/:appointmentId/reschedule y /status |
| Administración | Rutas por hospital para profesionales, especialidades, agendas, bloqueos y configuración |
| Auditoría | GET /hospitals/:id/audit con permisos y paginación |
| Operación | GET /health/live y /health/ready sin exponer configuración |

Listados con paginación y filtros. Disponibilidad devuelve profesional, agenda y duración del cupo además de fecha y hora; el servidor vuelve a validarlos al reservar. Reemplazar la carga global de `getState()` por consultas autorizadas. Actualizar otras estaciones mediante consultas periódicas inicialmente; considerar eventos después.

## Fases y criterios de aceptación

### 1. Base técnica y esquema

Crear backend, configuración de ejemplo sin secretos, base local, migraciones, seed ficticio y pruebas de integración contra PostgreSQL real. Entrega aceptada cuando una base vacía se inicialice de forma reproducible, las relaciones inválidas fallen y los datos sobrevivan a un reinicio.

### 2. Autenticación y autorización

Implementar sesiones y matriz de permisos antes de exponer datos. Aceptación: usuario sin sesión no puede operar; paciente A no puede consultar/modificar a B; personal de un hospital no puede acceder al otro; una sesión cerrada o vencida deja de funcionar.

### 3. Turnos, agendas y concurrencia

Trasladar reglas de negocio al servidor. Aceptación: dos reservas simultáneas y solapadas producen exactamente un éxito y un conflicto; horarios contiguos se permiten; cancelación libera el cupo; reprogramación fallida conserva el original; bloqueos simultáneos no dejan turnos incompatibles; doble envío crea una sola reserva.

### 4. Conexión del frontend

Sustituir servicios locales por adaptadores HTTP, conservar interfaz y mensajes claros, actualizar sesiones y contexto hospitalario. Aceptación: dos sesiones en navegadores independientes ven el mismo estado y el conflicto de cupo se muestra correctamente; ninguna reserva depende de localStorage. Un error de conexión no vuelve silenciosamente al modo demo.

### 5. Migración y piloto

Inventariar datos de cada navegador antes de importar: no hay hoy una fuente central. Exportación, validación, vista previa, detección de duplicados y mapeo de IDs; no importar cuentas demo ni hashes locales como accesos válidos. Conservar rechazados históricos. Probar restauración antes de borrar o sustituir información existente.

Piloto con personal y datos ficticios, seguido de un grupo controlado si el hospital valida el resultado. Aceptación: flujos completos de reserva, aprobación, llegada, atención, ausencia, cancelación y reprogramación, incluida recuperación ante errores.

### 6. Preparación operativa

Definir alojamiento, responsable técnico, actualizaciones, monitoreo, copias cifradas fuera del servidor y restauración ensayada. Acordar cuánto dato se admite perder y cuánto tiempo puede estar caído el servicio. Documentar contingencia ante cortes y tratamiento de datos con el responsable del hospital. La aceptación del piloto no equivale a autorización de producción.

## Decisiones pendientes

Antes de despliegue: internet o red local, cantidad de hospitales y usuarios simultáneos, servidor disponible, responsables de soporte, roles reales, identificación de pacientes, importación de datos existentes y alcance del módulo de estudios. Antes de dimensionar: medir carga esperada. Sin estimaciones de plazo o costo hasta definir esos puntos.

## Próxima tarea concreta

Implementar la fase 1 en entorno local: backend TypeScript, PostgreSQL, primera migración del modelo de turnos y seed ficticio. Continuar luego con permisos y API transaccional. No contratar infraestructura ni mover datos reales como parte de esta preparación.

## Fuentes técnicas

- PostgreSQL: rangos y restricciones de exclusión para impedir reservas superpuestas: https://www.postgresql.org/docs/18/rangetypes.html
- Node.js: utilizar una versión Active LTS o Maintenance LTS para producción: https://nodejs.org/en/about/previous-releases
