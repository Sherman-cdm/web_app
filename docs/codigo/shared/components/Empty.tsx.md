# Empty.tsx

[Índice general](../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../src/shared/components/Empty.tsx)

**Ruta:** `src/shared/components/Empty.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { Inbox } from 'lucide-react';

export function Empty({ text }: { text: string }) {
  return (
    <div className="card py-12 text-center">
      <Inbox className="mx-auto mb-3 text-slate-300" size={36} />
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}
```
