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
