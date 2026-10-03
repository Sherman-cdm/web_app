# ApiError.ts

[Índice general](../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../src/shared/errors/ApiError.ts)

**Ruta:** `src/shared/errors/ApiError.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public code: 'VALIDATION' | 'CONFLICT' | 'STORAGE' | 'NOT_FOUND',
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```
