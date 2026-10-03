# ErrorMessage.tsx

[Índice general](../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../src/shared/components/ErrorMessage.tsx)

**Ruta:** `src/shared/components/ErrorMessage.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
export function ErrorMessage({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="my-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      {message}
    </p>
  );
}
```
