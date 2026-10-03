# csv.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/utils/csv.ts)

**Ruta:** `src/utils/csv.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
export function exportCsv(filename: string, rows: (string | number)[][]) {
  const escaped = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell);
          return `"${(/^[=+@\-\t\r]/.test(value) ? `'${value}` : value).replace(/"/g, '""')}"`;
        })
        .join(';'),
    )
    .join('\r\n');
  const url = URL.createObjectURL(
    new Blob(['\uFEFF', escaped], { type: 'text/csv;charset=utf-8' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
```
