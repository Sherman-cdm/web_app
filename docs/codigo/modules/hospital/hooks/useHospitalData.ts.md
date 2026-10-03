# useHospitalData.ts

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/hooks/useHospitalData.ts)

**Ruta:** `src/modules/hospital/hooks/useHospitalData.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import { useCallback, useEffect, useRef, useState } from 'react';
import { CHANGE_EVENT } from '../../../infrastructure/storage/keys';
import { hospitalApi } from '../../../services/hospitalApi';
import { errorText } from '../../../shared/errors/errorText';
import type { HospitalState } from '../../../types';

export function useHospitalData() {
  const [state, setState] = useState<HospitalState | null>(null);
  const [error, setError] = useState('');
  const version = useRef(0);
  const load = useCallback(async () => {
    const request = ++version.current;
    try {
      const next = await hospitalApi.getState();
      if (request === version.current) {
        setState(next);
        setError('');
      }
    } catch (error) {
      if (request === version.current) setError(errorText(error));
    }
  }, []);
  useEffect(() => {
    void load();
    const refresh = () => {
      void load();
    };
    window.addEventListener('storage', refresh);
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => {
      version.current++;
      window.removeEventListener('storage', refresh);
      window.removeEventListener(CHANGE_EVENT, refresh);
    };
  }, [load]);
  return { state, error, load };
}
```
