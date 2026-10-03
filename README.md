# Mi salud · Hospitales de Pilar

**Sistema de Gestión de Turnos y Estudios para Hospitales de Pilar.** Una aplicación web responsiva que reúne la reserva de consultas, el seguimiento de turnos, la consulta de estudios y la organización de la atención hospitalaria en dos portales separados.

- **Portal del paciente:** acceso con DNI, selección de hospital y especialidad, calendario de disponibilidad, reserva de horarios, comprobante, consulta y cancelación de turnos, y resultados de estudios.
- **Portal médico y hospitalario:** acceso del equipo médico, aprobación y creación de turnos, recepción de pacientes, administración de profesionales y áreas, agendas, bloqueos, estudios, reportes y actividad.

Incluye el Hospital Central de Pilar, el Hospital Municipal Cirilo Sanguinetti y el Hospital de Presidente Derqui. Los profesionales, matrículas, agendas, pacientes y estudios de demostración son ficticios. No es un sistema oficial ni está conectado a los servicios municipales.

**Estado actual:** frontend funcional con servicios simulados y persistencia en el navegador. El backend con **Node.js + NestJS** y la base de datos **PostgreSQL** son la siguiente etapa y todavía no están implementados.

## Tecnologías

### Implementadas

| Tecnología | Uso |
| --- | --- |
| React 19 | Componentes e interfaces de ambos portales |
| TypeScript 5 | Tipado de entidades, servicios y componentes |
| Vite 7 | Servidor de desarrollo y compilación del frontend |
| Tailwind CSS 3 y CSS | Diseño adaptable, paleta de colores y estilos compartidos |
| Lucide React | Iconos de navegación y acciones |
| Vitest y jsdom | Pruebas automatizadas de servicios y reglas de negocio |
| Prettier | Formato consistente del código |
| localStorage y sessionStorage | Datos y sesión de demostración dentro del navegador |

Node.js y npm se utilizan actualmente para las herramientas de desarrollo del frontend; la aplicación todavía no incluye un servidor propio.

### Backend acordado para la próxima etapa

| Tecnología | Responsabilidad prevista |
| --- | --- |
| Node.js | Entorno de ejecución del servidor |
| NestJS con TypeScript | API REST modular, autenticación, permisos y reglas de negocio |
| PostgreSQL | Persistencia relacional de usuarios, hospitales, agendas, turnos y estudios |

## Instalación y ejecución local

### Requisitos

- Git para clonar el repositorio.
- Node.js 22.12 o superior dentro de la rama 22, o Node.js 24, con npm.
- Un navegador actualizado. PostgreSQL no es necesario para ejecutar esta versión de demostración.

### Descargar, instalar y ejecutar

```bash
git clone https://github.com/Sherman-cdm/web_app.git
cd web_app
npm ci
npm run dev
```

En Windows PowerShell, si la política de scripts bloquea `npm.ps1`, usar `npm.cmd ci` y `npm.cmd run dev`. `npm ci` instala las versiones exactas del archivo `package-lock.json`.

Abrir **http://127.0.0.1:5173/**. No se necesita un archivo `.env` ni configurar una base de datos para esta versión.

- Acceso de pacientes: http://127.0.0.1:5173/#login/patient
- Acceso médico: http://127.0.0.1:5173/#login/medical

### Cuentas de demostración

| Perfil | Usuario | Contraseña |
| --- | --- | --- |
| Paciente: María Prueba | DNI `30123456` | `Paciente123!` |
| Paciente: Juan Prueba | DNI `28987654` | `Paciente123!` |
| Equipo médico | `medico@pilar.demo` | `Medico123!` |

Cada pantalla ofrece **Completar datos de prueba**. El acceso médico abre la gestión hospitalaria existente; no implica permisos clínicos de producción. La sesión se conserva al recargar la pestaña, vence a las ocho horas y se elimina con Cerrar sesión. Acceder directamente a una URL de otro perfil muestra su pantalla de ingreso.

El paciente ve únicamente los turnos de su DNI y consulta estudios con ese mismo DNI. La reserva precarga sus datos y conserva el DNI de la sesión. Para probar otro paciente, cerrar sesión e ingresar con su cuenta de ejemplo.

El encabezado del paciente incluye un acceso al portal hospitalario. El menú hospitalario permite volver al paciente. Se puede elegir cualquiera de los tres hospitales desde la barra superior. Si Vite anuncia otro puerto, usar ese puerto en ambas direcciones.

## Portal hospitalario

| Sección | Funciones |
| --- | --- |
| Panel general | Jornada, solicitudes pendientes, sala de espera, profesionales y actividad reciente |
| Turnos y recepción | Agregar, aprobar, rechazar con motivo, reprogramar, cancelar, registrar llegada, atendido y ausente; filtros y exportación CSV |
| Profesionales | Incorporar, editar contacto y matrícula, asignar varias áreas, activar/desactivar |
| Áreas y especialidades | Crear, editar descripción y visibilidad para pacientes |
| Agendas | Publicar o editar jornadas por profesional y consultorio, duración, vigencia, semana tipo y bloqueos de fechas |
| Pacientes | Buscar por DNI o nombre; consultar contacto e historial administrativo de turnos y estudios |
| Estudios | Registrar, cargar un informe ficticio y publicar o dejar pendiente |
| Reportes | Filtrar por período; totales por estado y área, pacientes únicos y exportación CSV |
| Actividad | Historial local de operaciones |
| Configuración | Elegir aprobación manual o automática para nuevas solicitudes |

## Probar el circuito completo

1. Ingresar como paciente con DNI `30123456` y contraseña `Paciente123!`. Reservar en Hospital Central → Clínica médica → un día futuro habilitado → horario libre. Los datos del paciente se completan desde su cuenta.
2. La solicitud queda **Pendiente** y retiene el cupo. Abrir Acceso médico e ingresar con `medico@pilar.demo` / `Medico123!`. En Turnos y recepción, pulsar Aprobar → Confirmar cambio.
3. Volver al portal del paciente e ingresar nuevamente con su cuenta. En Mis Turnos se ve **Confirmado**. Recargar conserva el estado.
4. Desde Profesionales, agregar un profesional y asignarle un área. En Agendas publicar días, horario, duración, consultorio y vigencia. Los pacientes podrán reservar esos cupos.
5. Usar Agregar turno en recepción para una reserva confirmada directamente. Probar Reprogramar y Cancelar.
6. En Estudios registrar un informe con DNI `30123456`, escribir contenido ficticio y seleccionar Publicado. Consultar ese DNI desde Mis Estudios.

Datos iniciales: tres hospitales, nueve especialidades, nueve profesionales y nueve agendas. No se insertan turnos ficticios en tu historial automáticamente. Los DNI `30123456` y `28987654` tienen estudios de ejemplo.

## Pruebas y compilación

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

`test` ejecuta las pruebas del servicio y los circuitos hospitalarios. `build` verifica TypeScript y genera `dist/`. `preview` sirve esa compilación, normalmente en el puerto 4173. Para reinstalar exactamente las versiones entregadas, usar `npm.cmd ci`. En macOS/Linux se puede usar `npm` en lugar de `npm.cmd`.

`preview` permite revisar la compilación local; para publicar el frontend se debe servir `dist/` desde un alojamiento web. Compilar el proyecto no incorpora el backend ni convierte el login de ejemplo en autenticación real.

## Próxima etapa: API NestJS y PostgreSQL

La arquitectura prevista es:

```text
Frontend React + TypeScript
          │ HTTPS / API REST
          ▼
Servidor Node.js + NestJS
          │ Consultas y transacciones
          ▼
Base de datos PostgreSQL
```

El backend se organizará en módulos de autenticación y usuarios, hospitales, especialidades, profesionales, agendas y disponibilidad, turnos, pacientes, estudios, reportes y auditoría.

1. **Identidad y permisos:** reemplazar las cuentas públicas por usuarios reales, contraseñas protegidas y sesiones verificadas en el servidor. Aplicar permisos por paciente, profesional, recepción, administrador y hospital.
2. **Modelo de datos:** crear tablas y migraciones para usuarios, pacientes, hospitales, áreas, profesionales y sus asignaciones, consultorios, agendas, bloqueos, turnos, estudios y eventos de auditoría. La herramienta de acceso a datos y migraciones se definirá al implementar el backend.
3. **Disponibilidad y reservas:** llevar las reglas al servidor y usar transacciones y restricciones en PostgreSQL para evitar reservas duplicadas, sobreventa y superposiciones entre dispositivos.
4. **API REST:** implementar los contratos documentados en el [informe técnico](./INFORME_TECNICO.md), incluyendo catálogos, disponibilidad, reservas, gestión hospitalaria y estudios. Documentar la API con OpenAPI/Swagger.
5. **Conexión del frontend:** sustituir los servicios simulados de `src/services/` por adaptadores HTTP y conectar `authService.ts` con el servicio de identidad. Conservar los contratos TypeScript y los componentes; adaptar las consultas a la paginación y los permisos del servidor.
6. **Operación:** incorporar configuración por entorno, validación de entradas, pruebas de integración con PostgreSQL, copias de seguridad y registro de actividad del servidor. Los documentos de estudios necesitarán almacenamiento autorizado, además de sus metadatos en la base de datos.

Todavía no hay endpoints de servidor, migraciones, conexión PostgreSQL ni comandos para levantar una API en este repositorio. Esta sección describe el desarrollo acordado para la siguiente etapa.

## Datos y alcance

Ambos portales comparten `mi-salud.hospital.v2` en localStorage. Las reservas del formato anterior `mi-salud.appointments.v1` se incorporan al nuevo modelo; la clave anterior se conserva como copia. No se deben borrar claves para actualizar la aplicación.

Se evita la superposición de agendas del mismo profesional o consultorio. Un horario puede tener cupos de distintos profesionales. Las modificaciones que afectan turnos abiertos requieren reprogramarlos o cancelarlos previamente. Web Locks coordina las escrituras entre pestañas del mismo origen cuando está disponible; sin Web Locks, se serializan dentro de cada instancia.

Las interfaces cuentan con **login de demostración y control de navegación por perfil**. Las credenciales son públicas y se verifican en el frontend: **no hay autenticación segura de servidor, autorización real ni base de datos remota**. El filtro de DNI es parte de la experiencia visual, no una barrera de seguridad. Usar únicamente datos de ejemplo. Cambiar de navegador, dominio o puerto cambia el almacenamiento. El registro de actividad es editable desde el navegador y no constituye una auditoría clínica segura. La sesión guarda solo un identificador de cuenta y su vencimiento en `sessionStorage`, nunca la contraseña.

## Estructura

```text
src/
  App.tsx                  Selección entre los dos portales
  modules/
    auth/                  Pantallas de acceso, sesión y cierre de sesión
    patient/               Portal del paciente, organizado por funcionalidad
      booking/             Wizard, hook de reserva y pasos independientes
      appointments/        Mis turnos
      studies/             Mis estudios
      home/                Inicio
      specialties/         Cartelera
      components/          Encabezado, navegación y comprobante
    hospital/              Portal hospitalario
      appointments/        Página, formulario, tarjeta y cambio de estado
      professionals/       Página y formulario de profesionales
      areas/               Página y formulario de áreas
      agendas/             Página, formulario, tarjeta y bloqueos
      studies/             Página y formulario de estudios
      dashboard/           Panel general
      patients/            Directorio de pacientes
      reports/             Reportes
      activity/            Registro de actividad
      settings/            Configuración
      layout/              Barra superior y menú lateral
      hooks/               Carga de datos y navegación
      context/             Contexto del hospital seleccionado
  services/                API del paciente y fachada de API hospitalaria
    hospital/              Un servicio por funcionalidad
    __tests__/             Pruebas de integración y reglas de negocio
  domain/                  Disponibilidad, reservas, validaciones y actividad
  infrastructure/storage/  Repositorio local, claves y datos iniciales
  shared/                  Componentes reutilizables, errores y hooks comunes
  mocks/                   Catálogo inicial ficticio
  types/                   Contratos separados por entidad
  utils/                   Fechas, estados, búsqueda y exportación CSV
scripts/
  export-code.mjs           Generación de documentación por módulo y archivo
docs/codigo/               Índices navegables y código de cada archivo por separado
```

Para mantener el código legible:

```powershell
npm.cmd run format
npm.cmd run format:check
npm.cmd run typecheck
npm.cmd run docs:code
```

Editar los archivos de `src/`. `CODIGO_COMPLETO.md` es un índice breve que enlaza la documentación separada por módulo y archivo en `docs/codigo/`. Cada página incluye su código, un enlace al archivo fuente y enlaces para volver al módulo o al índice. Estos documentos no forman parte del código ejecutado por la aplicación.

Ver [la guía de arquitectura](./ARQUITECTURA.md), [el informe técnico](./INFORME_TECNICO.md) y [todo el código por ruta](./CODIGO_COMPLETO.md).
