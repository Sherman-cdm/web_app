# Código completo · Índice por módulos

**Referencia para consultar y copiar el código.** La aplicación ejecuta los archivos de `src/`. Este índice te lleva al módulo y después al archivo que necesitás, sin cargar todo el proyecto en una sola página.

Se documentan **108 archivos**, cada uno en su propia página, dentro de `docs/codigo/`.

| Apartado | Archivos |
| --- | ---: |
| [Entrada y estilos de la aplicación](./docs/codigo/aplicacion/README.md) | 3 |
| [Acceso de pacientes y médicos](./docs/codigo/modules/auth/README.md) | 4 |
| [Portal del paciente](./docs/codigo/modules/patient/README.md) | 16 |
| [Portal hospitalario](./docs/codigo/modules/hospital/README.md) | 26 |
| [Elementos compartidos](./docs/codigo/shared/README.md) | 12 |
| [Servicios y pruebas](./docs/codigo/services/README.md) | 12 |
| [Reglas de negocio](./docs/codigo/domain/README.md) | 5 |
| [Persistencia e infraestructura](./docs/codigo/infrastructure/README.md) | 3 |
| [Tipos y contratos](./docs/codigo/types/README.md) | 9 |
| [Utilidades](./docs/codigo/utils/README.md) | 6 |
| [Datos de ejemplo](./docs/codigo/mocks/README.md) | 2 |
| [Configuración del proyecto](./docs/codigo/configuracion/README.md) | 9 |
| [Herramientas de documentación](./docs/codigo/herramientas/README.md) | 1 |

## Cómo usarlo

1. Abrí el apartado que querés consultar.
2. Elegí el módulo y su archivo.
3. Consultá o copiá el código, o usá **Abrir archivo fuente** para editarlo.
4. Usá **Volver al módulo** o **Índice general** para navegar.

[Guía de arquitectura](./ARQUITECTURA.md) · [Instalación y uso](./README.md) · [Informe técnico](./INFORME_TECNICO.md)

## Actualizar la documentación

Después de modificar el código fuente, ejecutá desde la carpeta del proyecto:

```powershell
npm.cmd run docs:code
```

El comando regenera este índice y los documentos por archivo. Editá siempre el código fuente; las copias de documentación se sobrescriben.
