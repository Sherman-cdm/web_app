# study.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/types/study.ts)

**Ruta:** `src/types/study.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
export interface MedicalStudy {
  id: string;
  hospitalId: string;
  dni: string;
  name: string;
  date: string;
  status: 'available' | 'pending';
  result?: string;
}
```
