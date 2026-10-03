# time.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/utils/time.ts)

**Ruta:** `src/utils/time.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
export const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));

export const timeText = (value: number) =>
  `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;

export const overlap = (start: number, length: number, otherStart: number, otherLength: number) =>
  start < otherStart + otherLength && otherStart < start + length;
```
