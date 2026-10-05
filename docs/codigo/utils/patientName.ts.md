# patientName.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/utils/patientName.ts)

**Ruta:** `src/utils/patientName.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
/** Presentación uniforme, también para cuentas y turnos guardados anteriormente. */
export function patientName(name: string): string {
  return name.toLocaleUpperCase('es-AR');
}

export function patientActivityDetail(action: string, detail: string): string {
  const patientActions = [
    'Turno creado',
    'Turno reprogramado',
    'Turno cancelado',
    'Estado de turno actualizado',
  ];
  const separator = detail.lastIndexOf(' · ');
  return patientActions.includes(action) && separator >= 0
    ? patientName(detail.slice(0, separator)) + detail.slice(separator)
    : detail;
}
```
