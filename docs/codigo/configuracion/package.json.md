# package.json

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../package.json)

**Ruta:** `package.json`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```json
{
  "name": "mi-salud-pilar",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write src scripts *.json *.js *.ts index.html",
    "format:check": "prettier --check src scripts *.json *.js *.ts index.html",
    "docs:code": "node scripts/export-code.mjs"
  },
  "dependencies": {
    "lucide-react": "^0.468.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@types/node": "^22.20.5",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.0.0",
    "autoprefixer": "^10.4.21",
    "jsdom": "^26.1.0",
    "postcss": "^8.5.6",
    "prettier": "^3.9.9",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.9.2",
    "vite": "^7.1.0",
    "vitest": "^4.1.11"
  }
}
```
