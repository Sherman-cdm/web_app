# errorText.ts

[Índice general](../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../src/shared/errors/errorText.ts)

**Ruta:** `src/shared/errors/errorText.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
export function errorText(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error. Volvé a intentar.';
}
```
