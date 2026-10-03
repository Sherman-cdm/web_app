# Informe Técnico de Entrega · Mi salud

Actualización: 2 de octubre de 2026. Sistema de Gestión de Turnos y Estudios — Hospitales de Pilar.

## 1. Resumen ejecutivo

Se entrega una aplicación frontend con dos experiencias diferenciadas: el portal del paciente y el portal hospitalario. Ambos comparten el catálogo, las agendas, los turnos y los estudios del mismo navegador. El portal hospitalario tiene navegación lateral en escritorio y menú desplegable en móvil.

El paciente selecciona hospital, especialidad, fecha y horario; completa sus datos; recibe un comprobante; consulta estados, cancela reservas y descarga resultados ficticios. El hospital administra solicitudes y reservas, profesionales, áreas, agendas, bloqueos, estudios e indicadores.

### Módulos hospitalarios

1. Panel general: turnos de hoy, solicitudes pendientes, pacientes en espera, equipo activo y actividad reciente.
2. Turnos y recepción: aprobación, rechazo con motivo, creación directa, reprogramación, cancelación, llegada, atención y ausencia. Filtros por paciente/DNI, fecha, estado y área; exportación CSV de los registros filtrados.
3. Profesionales: altas, edición, matrícula, contacto, varias áreas asignadas y estado activo/inactivo.
4. Áreas: altas, edición de descripción, activación/desactivación y visibilidad para pacientes.
5. Agendas: jornadas recurrentes por profesional, área y consultorio; días, franja horaria, duración y vigencia; vista de semana tipo; bloqueos de días completos por profesional o por hospital.
6. Pacientes: directorio generado a partir de turnos y estudios, contacto e historial administrativo del hospital seleccionado.
7. Estudios: registro, edición del informe ficticio y publicación para el paciente.
8. Reportes: período por fecha de turno, totales, pacientes únicos, distribución por estado y área, exportación CSV.
9. Actividad: operaciones locales con fecha, actor de demostración y detalle.
10. Configuración: aprobación manual o automática para solicitudes nuevas.

El alcance es una demostración funcional local con dos pantallas de login y sesiones de ejemplo. No incluye autenticación segura de servidor, usuarios reales, historia clínica, prescripción, facturación, internación, firma digital ni conexión municipal. No se incorpora información clínica real.

## 2. Decisiones de arquitectura

### Stack y organización

Vite sirve y compila la aplicación; React compone las vistas; TypeScript define los contratos compartidos. Tailwind CSS 3 mantiene el archivo `tailwind.config.js` y las directivas de `src/index.css`. Lucide proporciona iconos SVG locales. Las referencias del stack están en la [guía de Vite](https://vite.dev/guide/), [documentación de React](https://react.dev/learn/build-a-react-app-from-scratch) y [Tailwind CSS 3](https://v3.tailwindcss.com/).

`App.tsx` elige el portal según el fragmento de URL. Las rutas `#home`, `#booking`, `#appointments` y `#studies` pertenecen al paciente; `#hospital/...` pertenece al hospital. La navegación funciona con Atrás/Adelante y no requiere reescrituras de rutas en el alojamiento estático.

El código está organizado por funcionalidades en `src/modules/patient` y `src/modules/hospital`. Cada módulo agrupa su página, formularios y componentes específicos. El contexto del hospital está en `modules/hospital/context`, y los hooks de carga/navegación en `modules/hospital/hooks`. Los controles reutilizables y diálogos se encuentran en `shared/components`, cada uno en su archivo.

`services/api.ts` mantiene las firmas consumidas por el paciente. `services/hospitalApi.ts` es una fachada pequeña que compone servicios independientes de turnos, profesionales, áreas, agendas, estudios y configuración. `domain/` contiene las reglas de reservas y disponibilidad; `infrastructure/storage/` contiene el repositorio local, las claves y el catálogo inicial. Los contratos están separados por entidad en `types/` y se reexportan desde su índice.

`App.tsx` solo selecciona el portal. El wizard tiene un hook de lógica y cinco componentes de pasos. Los formularios y tarjetas hospitalarios están separados de las páginas. Prettier aplica formato multilínea consistente; TypeScript detecta variables, parámetros e imports sin uso. La estructura detallada y las reglas de mantenimiento están en [ARQUITECTURA.md](./ARQUITECTURA.md). `CODIGO_COMPLETO.md` es una exportación generada con `npm.cmd run docs:code`, no un archivo ejecutable ni una fuente de edición.

La documentación del código también está modularizada: `CODIGO_COMPLETO.md` es un índice breve que enlaza los apartados de `docs/codigo/`. Cada archivo fuente tiene una página independiente con código íntegro, enlace al original y navegación de regreso. El generador crea automáticamente los índices por carpeta.

### Accesos de pacientes y médicos

`modules/auth/` reúne las pantallas de ingreso, el formulario y el contexto de sesión. `authService.ts` valida cuentas públicas de demostración de `mocks/demoAccounts.ts`. Pacientes usan DNI y contraseña; médicos, correo y contraseña. `App.tsx` verifica el perfil antes de mostrar cada portal. Una sesión permite un perfil a la vez, persiste en la pestaña mediante `sessionStorage`, vence a las ocho horas y se cierra desde ambos encabezados.

Las cuentas son `30123456` o `28987654` con `Paciente123!`, y `medico@pilar.demo` con `Medico123!`. No hay alta de cuentas, recuperación de contraseñas ni correspondencia automática entre profesionales nuevos y credenciales. El acceso médico habilita la gestión hospitalaria de ejemplo existente. El portal del paciente filtra turnos por su DNI, utiliza ese DNI para estudios y precarga los datos al reservar.

Este control es exclusivamente de interfaz: credenciales, sesión y datos son manipulables en el cliente. Para producción se debe sustituir el servicio por autenticación y autorización del servidor, con comprobación de identidad y pertenencia de cada recurso. La separación de pantallas no garantiza confidencialidad clínica.

### Contratos añadidos

Además de Hospital, Specialty, TimeSlot, Patient, Appointment y MedicalStudy, se definen Professional, Agenda, AgendaBlock, HospitalSettings, AuditEntry y HospitalState. Los turnos contienen profesional, agenda, duración, origen y motivo cuando corresponda. Las fechas son `YYYY-MM-DD`; los horarios, `HH:mm`; la agenda opera en la zona de Buenos Aires.

### Reglas de negocio

- Una solicitud del paciente queda `pending`, salvo aprobación automática configurada para ese hospital. Una reserva de recepción queda `confirmed`.
- Los estados pendientes, confirmados y en espera retienen el cupo. Rechazar o cancelar libera disponibilidad. Los registros se conservan en el historial.
- Las transiciones permitidas se validan en el servicio. Se exige motivo para rechazar/cancelar desde recepción. No se aprueba un horario ya pasado; se puede reprogramar. La llegada se registra el día del turno y no se registra atención en una fecha futura.
- Cada agenda pertenece a un profesional y área del hospital. Solo se ofrecen agendas activas de profesionales activos en áreas activas, dentro de su vigencia y fuera de bloqueos.
- Los cupos se calculan por profesional. Dos profesionales pueden atender a la misma hora en distintos consultorios. Se evita solapamiento de intervalos del paciente y del profesional.
- No se permiten agendas recurrentes que se superpongan en días, horas y períodos de vigencia para un mismo profesional o consultorio.
- No se desactiva un área/profesional ni se retira un horario si el cambio afecta turnos abiertos desde hoy. Los bloqueos con turnos abiertos en el período también se rechazan.
- La reprogramación valida el nuevo cupo y conserva el identificador. Si falla, el turno original y el registro de actividad permanecen intactos.
- Los informes publicados necesitan texto. Los pendientes no ofrecen descarga en el portal del paciente.

### Persistencia y compatibilidad

El estado completo se escribe en una sola clave, `mi-salud.hospital.v2`, después de validar la operación. Los cambios y su actividad se guardan juntos. Una cola serializa operaciones de la instancia y Web Locks coordina pestañas del mismo origen cuando está disponible. El portal hospitalario escucha cambios locales y de otras pestañas.

Si no existe la clave nueva, se construye el catálogo inicial y se leen las reservas de `mi-salud.appointments.v1`. A esos turnos se les asigna el profesional y la agenda inicial de su especialidad. La primera escritura persiste el nuevo formato; la clave anterior permanece intacta. Si los datos no se pueden leer o guardar, se muestra el error y no se confirma la operación.

No hay garantía distribuida entre dispositivos. Sin Web Locks, la protección de concurrencia solo cubre la instancia. La validación del almacenamiento detecta errores básicos; no sustituye un esquema validado por un servidor. Los datos de localStorage pueden ser modificados por el usuario.

### Diseño responsivo y accesibilidad

Se utilizan grillas adaptables, botones táctiles, etiquetas de formulario, estado visible, foco y diálogos nativos con navegación de teclado. La barra lateral se convierte en menú en móvil. El portal del paciente conserva navegación inferior. Los diálogos limitan su altura y permiten desplazamiento para completar formularios extensos.

## 3. Puesta en marcha

Requisito: Node.js 22.12 o superior, o Node.js 24.

```powershell
cd "C:\Users\German\.gemini\antigravity\scratch\target-analyzer-\Mi salud"
npm.cmd install
npm.cmd run dev
```

Abrir http://127.0.0.1:5173/#hospital/dashboard para el hospital y http://127.0.0.1:5173/#home para pacientes. Si el puerto está ocupado, usar el anunciado por Vite. `npm.cmd` evita la restricción de ejecución de `npm.ps1` de PowerShell; en otras terminales puede usarse `npm`.

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

La compilación realiza el control de TypeScript y genera `dist/`. Publicar esa carpeta en un alojamiento estático para una demostración; `preview` es solo un servidor de comprobación local. El lockfile permite reinstalar con `npm.cmd ci`.

## 4. Manual de prueba de usuario

### Solicitud y aprobación

1. Ingresar como paciente con `30123456` / `Paciente123!` y elegir Hospital Central y Clínica médica.
2. Seleccionar una fecha futura habilitada y un horario libre.
3. Revisar los datos precargados de María Prueba. El DNI `30123456` pertenece a la sesión y no es editable.
4. Enviar la solicitud: el comprobante indica revisión hospitalaria.
5. Abrir Acceso médico e ingresar con `medico@pilar.demo` / `Medico123!`. Seleccionar Hospital Central y entrar en Turnos y recepción.
6. Pulsar Aprobar y confirmar. Volver a Mis Turnos del paciente: el estado es Confirmado. Recargar para comprobar la persistencia.
7. Repetir con otro horario y probar rechazo con motivo; el paciente ve el estado y el motivo.

### Profesionales y agendas

1. Crear un área, por ejemplo Neurología, o utilizar una existente.
2. Incorporar un profesional con nombre, matrícula, correo y teléfono ficticios. Asignarle el área.
3. En Agendas, crear una agenda de ese profesional. Completar consultorio, días, inicio/finalización, duración y vigencia futura.
4. Volver al paciente y elegir esa área: los cupos se ofrecen dentro de su agenda.
5. Intentar publicar una agenda superpuesta del mismo profesional o consultorio: se informa el conflicto.
6. Crear un bloqueo en un día sin turnos abiertos y comprobar que sus horarios desaparecen. Retirarlo restituye los cupos.

### Recepción y seguimiento

1. Pulsar Agregar turno y seleccionar área, profesional opcional, fecha y horario disponible. Completar datos ficticios del paciente.
2. La reserva se crea confirmada. Reprogramarla y comprobar que se libera el horario anterior.
3. Para un turno del día, registrar llegada y después atención. El panel actualiza la sala de espera.
4. Cancelar con motivo conserva el historial y libera el cupo. Las modificaciones se registran en Actividad.
5. Filtrar por fecha/estado/área y descargar CSV. Reportes permite elegir un período y exportar el resumen por área.

### Estudios y pacientes

1. Crear un estudio con DNI `30123456`, nombre, fecha no futura y contenido de ejemplo.
2. Seleccionar Publicado y guardar. En el paciente, consultar Mis Estudios con ese DNI y descargar el TXT ficticio.
3. Cambiar un estudio a Pendiente: deja de ofrecerse la descarga al consultar de nuevo.
4. Consultar la ficha administrativa del paciente y su historial en el hospital seleccionado.

Los DNI iniciales `30123456` y `28987654` tienen estudios de ejemplo. Los registros de prueba del navegador automatizado se generaron en una sesión aislada; no se insertaron en el navegador personal del usuario.

## 5. Hoja de ruta para backend

El stack acordado para esta etapa es **Node.js como entorno de ejecución, NestJS con TypeScript para la API REST y PostgreSQL como base de datos relacional**. Su implementación está pendiente; el frontend entregado utiliza servicios simulados y almacenamiento local. Los módulos NestJS cubrirán identidad y permisos, hospitales, profesionales, áreas, agendas, turnos, pacientes, estudios, reportes y auditoría. Las reservas requerirán transacciones y restricciones en PostgreSQL; la herramienta de acceso a datos y migraciones se elegirá al iniciar esa implementación.

### Contratos REST propuestos

Base `/api/v1`, JSON, fechas y horarios según los DTO de `src/types/index.ts`.

| Método y recurso | Finalidad / respuesta |
| --- | --- |
| GET `/hospitals` | Catálogo `Hospital[]` |
| GET `/specialties?hospitalId=...` | Áreas visibles `Specialty[]` |
| GET `/time-slots?hospitalId=...&specialtyId=...&date=...` | Cupos `TimeSlot[]` |
| GET `/appointments` | Turnos del paciente autenticado |
| POST `/appointments` | `BookingRequest` → 201 `Appointment` pendiente o confirmado según reglas |
| PATCH `/appointments/{id}/cancel` | Cancelación del paciente autenticado |
| GET `/studies` | Estudios del paciente autenticado; familiares solo mediante autorización |
| GET `/studies/{id}/result` | Archivo real autorizado o enlace temporal |
| GET `/hospital/{hospitalId}/appointments` | Listado administrativo con filtros y paginación |
| POST `/hospital/{hospitalId}/appointments` | Reserva confirmada de recepción |
| PATCH `/hospital/{hospitalId}/appointments/{id}/status` | `{status, reason}` → `Appointment` |
| PATCH `/hospital/{hospitalId}/appointments/{id}/schedule` | Datos de reprogramación → `Appointment` |
| GET/POST/PATCH `/hospital/{hospitalId}/professionals[/{id}]` | Catálogo, alta y edición de profesionales |
| GET/POST/PATCH `/hospital/{hospitalId}/specialties[/{id}]` | Gestión de áreas |
| GET/POST/PATCH `/hospital/{hospitalId}/agendas[/{id}]` | Gestión de agendas |
| GET/POST/DELETE `/hospital/{hospitalId}/blocks[/{id}]` | Bloqueos de disponibilidad |
| GET `/hospital/{hospitalId}/patients[/{dni}]` | Directorio/ficha administrativa autorizados |
| GET/POST/PATCH `/hospital/{hospitalId}/studies[/{id}]` | Registro y publicación de estudios |
| GET `/hospital/{hospitalId}/reports?from=...&to=...` | Agregados del período |
| GET `/hospital/{hospitalId}/audit` | Auditoría del servidor |
| GET/PATCH `/hospital/{hospitalId}/settings` | Política de aprobación |

Errores normalizados: `{"code":"CONFLICT","message":"El horario ya no está disponible"}`. Usar 400/422 para validación, 401 para falta de identidad, 403 para permisos, 404 para inexistencia y 409 para conflictos. Incorporar `Idempotency-Key` en creación de reservas y control de versión en modificaciones.

### Integración técnica

1. Implementar autenticación y permisos: administrador hospitalario, recepción, profesional y paciente. El servidor verifica hospital, propietario y operación; cambiar la URL o el selector no concede permisos.
2. Crear tablas de hospitales, áreas, profesionales y asignaciones, consultorios, agendas, bloqueos, pacientes, turnos, estudios, configuración y auditoría. El mock usa un nombre de consultorio; el backend debe normalizarlo a un identificador.
3. Ejecutar reservas/reprogramaciones y asignación de cupos en transacciones. Garantizar conflictos de intervalos y evitar sobreventa desde dispositivos distintos. Tratar feriados, licencias, recursos compartidos y excepciones de agenda.
4. Sustituir `api.ts` y `hospitalApi.ts` por adaptadores HTTP que conserven sus firmas. Un adaptador temporal puede componer el estado del hospital con varios endpoints; para mayor volumen, paginar listados y cargar cada módulo por separado.
5. Validar respuestas y entradas con esquemas. Normalizar mensajes del servidor a `ApiError`. Mantener toda autorización y regla crítica en el servidor.
6. Incorporar sesiones seguras, HTTPS, manejo de expiración, protección de operaciones y auditoría con identidad verificada. El historial local actual es una ayuda de demostración, no una auditoría confiable.
7. Reemplazar el texto ficticio del estudio por almacenamiento de documentos autorizado, metadatos y un flujo real de publicación. Añadir firma y protocolos clínicos solo con requisitos institucionales definidos.
8. Reemplazar los eventos locales por invalidación de consultas o eventos del servidor para sincronizar puestos de trabajo. Probar acceso entre hospitales, concurrencia, idempotencia y recuperación.

La separación visual entre portales ya está implementada; la separación de seguridad requiere este backend. No se debe migrar localStorage directamente como fuente de información clínica.

## 6. Verificación de entrega

Después de la reorganización modular se ejecutaron nuevamente las 25 pruebas, la compilación con detección de imports/variables sin uso y `format:check`. En Chromium se verificaron otra vez la reserva de cinco pasos, aprobación, reprogramación, persistencia, formularios de áreas/profesionales/agendas/bloqueos, publicación de estudios y navegación de los diez módulos en móvil y escritorio, sin errores de consola.

- 33 pruebas automatizadas aprobadas: flujo paciente, migración, persistencia, aprobación, rechazo, reprogramación, aislamiento por hospital en operaciones, profesionales/áreas, agendas superpuestas, capacidad de varios profesionales, bloqueos, estudios, configuración, fallos de almacenamiento y ocho casos de autenticación de demostración.
- Accesos verificados en navegador: contraseña incorrecta, navegación por perfil, acceso directo por URL, recuperación de sesión al recargar, cierre de sesión, reserva con datos precargados y visualización de turnos y estudios de la cuenta activa. Ambas pantallas de acceso se probaron en anchos de 320, 375, 768 y 1280 píxeles, sin desbordamiento horizontal ni errores de consola.
- Compilación con TypeScript y Vite correcta.
- Chromium: solicitud del paciente y aprobación hospitalaria, reflejo en Mis Turnos, alta de área/profesional/agenda, creación y reprogramación desde recepción, publicación de estudios al paciente y persistencia al recargar.
- Diez secciones hospitalarias revisadas sin desborde horizontal en 320, 375, 768 y 1280 px. Menú móvil comprobado. Sin errores JavaScript en el circuito probado.
- Capturas: `portal-hospital-escritorio.png` y `portal-hospital-movil.png`.

Las pruebas de navegador utilizaron Puppeteer disponible en el proyecto padre y una sesión aislada. No sustituyen validación institucional, pruebas de todos los dispositivos ni una auditoría completa de accesibilidad.
