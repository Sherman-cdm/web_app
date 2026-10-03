# useHospitalNavigation.ts

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/hooks/useHospitalNavigation.ts)

**Ruta:** `src/modules/hospital/hooks/useHospitalNavigation.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../../../shared/hooks/useMediaQuery';
import { currentPage } from '../navigation';

export function useHospitalNavigation(hospitalId: string) {
  const mobile = useMediaQuery('(max-width: 1023px)');
  const [page, setPage] = useState(currentPage);
  const [open, setOpen] = useState(false);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const change = () => {
      setPage(currentPage());
      setOpen(false);
    };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    main.current?.focus();
    window.scrollTo(0, 0);
  }, [page, hospitalId]);
  useEffect(() => {
    if (!mobile || !open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.getElementById('hospital-navigation')?.querySelector<HTMLElement>('a')?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', escape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', escape);
    };
  }, [mobile, open]);
  return { mobile, page, open, setOpen, main };
}
```
