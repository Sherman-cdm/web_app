# Loading.tsx

[Índice general](../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../src/shared/components/Loading.tsx)

**Ruta:** `src/shared/components/Loading.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { LoaderCircle } from 'lucide-react';

export function Loading({ text = 'Cargando información…' }: { text?: string }) {
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-xl bg-white p-6 text-sm text-slate-500"
    >
      <LoaderCircle className="animate-spin" aria-hidden="true" size={20} />
      {text}
    </div>
  );
}
```
