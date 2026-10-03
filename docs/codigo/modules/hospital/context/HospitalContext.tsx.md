# HospitalContext.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/context/HospitalContext.tsx)

**Ruta:** `src/modules/hospital/context/HospitalContext.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { createContext, useContext } from 'react';
import type { HospitalState } from '../../../types';

interface HospitalContextValue {
  state: HospitalState;
  hospitalId: string;
}

export const HospitalContext = createContext<HospitalContextValue | null>(null);

export function useHospital() {
  const context = useContext(HospitalContext);
  if (!context) throw new Error('useHospital debe utilizarse dentro del portal hospitalario.');
  return context;
}
```
