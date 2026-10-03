# Organización del código · Mi salud

El código fuente está dividido por funcionalidades y responsabilidades. Para cambiar la aplicación, editar el archivo correspondiente de `src/`. `CODIGO_COMPLETO.md` es un índice breve de consulta: enlaza a `docs/codigo/`, donde hay índices por módulo y una página por archivo fuente. Las páginas incluyen navegación de regreso y un enlace al archivo original. Esta documentación se regenera y no se importa en la aplicación.

## Cómo se conectan las capas

```text
App.tsx
  ├─ modules/auth/          Sesión de demostración y selección de acceso
  ├─ modules/patient/PatientPortal.tsx
  └─ modules/hospital/HospitalPortal.tsx
        ↓
Páginas, formularios, tarjetas y hooks del módulo
        ↓
services/api.ts o services/hospitalApi.ts
        ↓
Servicios por funcionalidad + reglas de domain/
        ↓
infrastructure/storage/hospitalRepository.ts
        ↓
localStorage
```

Los portales consumen servicios. Los servicios coordinan reglas de negocio y persistencia. `domain/` trabaja con datos y validaciones, sin componentes React. `infrastructure/storage/` administra lectura, migración y escrituras atómicas locales. Las claves de almacenamiento, los datos y los contratos públicos se conservan durante esta reorganización.

## Dónde realizar cada cambio

| Necesidad | Ubicación |
| --- | --- |
| Elegir portal | `src/App.tsx` |
| Pantallas de login por perfil | `modules/auth/LoginPage.tsx` y `components/LoginForm.tsx` |
| Estado de sesión y cierre | `modules/auth/AuthContext.tsx` |
| Validación de cuentas de ejemplo | `services/authService.ts` y `mocks/demoAccounts.ts` |
| Cambiar menú hospitalario | `modules/hospital/navigation.ts` y `layout/HospitalSidebar.tsx` |
| Cambiar encabezado hospitalario | `modules/hospital/layout/HospitalHeader.tsx` |
| Carga y actualización de datos del hospital | `modules/hospital/hooks/useHospitalData.ts` |
| Navegación y comportamiento móvil | `modules/hospital/hooks/useHospitalNavigation.ts` |
| Página de recepción | `modules/hospital/appointments/AppointmentsPage.tsx` |
| Formulario de turnos | `modules/hospital/appointments/AppointmentForm.tsx` |
| Tarjeta y acciones de turno | `modules/hospital/appointments/AppointmentCard.tsx` |
| Confirmación de aprobación/rechazo/cancelación | `modules/hospital/appointments/StatusChangeDialog.tsx` |
| Página/formulario de profesionales | `modules/hospital/professionals/` |
| Página/formulario de áreas | `modules/hospital/areas/` |
| Agendas y bloqueos | `modules/hospital/agendas/` |
| Publicación de estudios | `modules/hospital/studies/` |
| Paso del calendario del paciente | `modules/patient/booking/steps/CalendarStep.tsx` |
| Estado y envío de la reserva | `modules/patient/booking/useBookingWizard.ts` |
| Cupos, agendas aplicables y superposiciones | `domain/availability.ts` |
| Creación y reprogramación de la reserva | `domain/booking.ts` |
| Operaciones administrativas por módulo | `services/hospital/*.service.ts` |
| Persistencia y migración | `infrastructure/storage/hospitalRepository.ts` |
| Datos iniciales | `infrastructure/storage/seed.ts` y `mocks/mockData.json` |
| Componentes reutilizables | `shared/components/` |
| Tipos y contratos | `types/` |

Las rutas de la tabla son relativas a `src/`, salvo donde se indica explícitamente.

## Convenciones

- Cada funcionalidad hospitalaria tiene su carpeta. La página coordina filtros y selección; el formulario edita y guarda; la tarjeta muestra un registro.
- Los hooks contienen estado, efectos y llamadas asíncronas de interfaz. El JSX se mantiene en componentes.
- Un componente específico del hospital o del paciente vive en su módulo. Un control reutilizable vive en `shared/components/`.
- Las reglas que afectan cupos, validación o transiciones viven en servicios/dominio; no se duplican en los formularios.
- Los servicios no importan componentes, contextos ni hooks de React.
- `hospitalApi.ts` compone las operaciones de los servicios por funcionalidad para conservar el contrato consumido por la interfaz.
- `types/index.ts` solo reexporta contratos. Las entidades se editan en sus archivos respectivos.
- Evitar agregar una página entera a otra página. Crear el componente/formulario correspondiente y utilizarlo por importación.
- Mantener código multilínea con Prettier. TypeScript comprueba también código e imports sin uso.

## Ejemplo de módulo

```text
modules/hospital/appointments/
  AppointmentsPage.tsx     Filtros, listado y selección de operación
  AppointmentCard.tsx      Información y acciones de un turno
  AppointmentForm.tsx      Alta y reprogramación
  StatusChangeDialog.tsx   Confirmación y motivo del cambio de estado

services/hospital/appointments.service.ts  Operaciones y transiciones
domain/booking.ts                          Reglas compartidas de reserva
types/appointment.ts                       Contratos
```

## Comprobaciones

```powershell
npm.cmd run format
npm.cmd run format:check
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run docs:code
```

La suite está en `src/services/__tests__/`. Verifica el circuito entre portales, las reglas de negocio y el acceso de demostración: migración, persistencia, cupos, bloqueos, roles, expiración, cierre de sesión y fallos de almacenamiento.

La documentación incluye automáticamente los archivos actuales de `src/`, por lo que agregar un módulo no requiere modificar una lista manual. El generador actualiza el índice general, los índices de carpetas y las páginas individuales de código. No editar esas copias directamente: se sobrescriben al ejecutar `npm.cmd run docs:code`.
