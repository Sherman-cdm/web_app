# export-code.mjs

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../scripts/export-code.mjs)

**Ruta:** `scripts/export-code.mjs`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

````javascript
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function sourceFiles(directory) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const relative = `${directory}/${entry.name}`;
      return entry.isDirectory() ? sourceFiles(relative) : relative;
    }),
  );
  return files.flat().sort();
}
const files = [
  'package.json',
  '.gitignore',
  '.prettierrc.json',
  '.prettierignore',
  'index.html',
  'tsconfig.json',
  'vite.config.ts',
  'tailwind.config.js',
  'postcss.config.js',
  'scripts/export-code.mjs',
  ...(await sourceFiles('src')),
];

const docsRoot = 'docs/codigo';
const titles = {
  '': 'Biblioteca de código',
  aplicacion: 'Entrada y estilos de la aplicación',
  configuracion: 'Configuración del proyecto',
  herramientas: 'Herramientas de documentación',
  modules: 'Portales de la aplicación',
  'modules/auth': 'Acceso de pacientes y médicos',
  'modules/patient': 'Portal del paciente',
  'modules/hospital': 'Portal hospitalario',
  shared: 'Elementos compartidos',
  domain: 'Reglas de negocio',
  services: 'Servicios y pruebas',
  infrastructure: 'Persistencia e infraestructura',
  types: 'Tipos y contratos',
  utils: 'Utilidades',
  mocks: 'Datos de ejemplo',
};
const folderNames = {
  activity: 'Registro de actividad',
  agendas: 'Agendas y bloqueos',
  appointments: 'Turnos',
  areas: 'Áreas y especialidades',
  booking: 'Reserva paso a paso',
  components: 'Componentes',
  context: 'Contexto',
  dashboard: 'Panel general',
  errors: 'Manejo de errores',
  home: 'Inicio',
  hooks: 'Hooks de estado y efectos',
  hospital: 'Servicios hospitalarios',
  layout: 'Estructura visual y navegación',
  patients: 'Directorio de pacientes',
  professionals: 'Profesionales',
  reports: 'Reportes',
  settings: 'Configuración hospitalaria',
  specialties: 'Cartelera de especialidades',
  steps: 'Pasos del formulario de reserva',
  storage: 'Almacenamiento local',
  studies: 'Estudios y resultados',
  __tests__: 'Pruebas automatizadas',
};
const title = (directory) =>
  titles[directory] ?? folderNames[path.posix.basename(directory)] ?? directory;
const indexPath = (directory) => path.posix.join(docsRoot, directory, 'README.md');
const link = (from, to) => {
  const relative = path.posix.relative(path.posix.dirname(from), to);
  return relative.startsWith('.') ? relative : `./${relative}`;
};

function documentationPath(file) {
  if (file.startsWith('src/')) {
    const relative = file.slice(4);
    return (
      path.posix.join(docsRoot, relative.includes('/') ? relative : `aplicacion/${relative}`) +
      '.md'
    );
  }
  const directory = file.startsWith('scripts/') ? 'herramientas' : 'configuracion';
  return `${docsRoot}/${directory}/${path.posix.basename(file)}.md`;
}

async function save(file, contents) {
  const absolute = path.join(root, file);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, contents, 'utf8');
}

const entries = files.map((source) => ({ source, document: documentationPath(source) }));
const directories = new Set(['']);
for (const entry of entries) {
  let directory = path.posix.relative(docsRoot, path.posix.dirname(entry.document));
  while (directory && directory !== '.') {
    directories.add(directory);
    directory = path.posix.dirname(directory);
  }
}

await Promise.all(
  entries.map(async ({ source, document }) => {
    const code = (await readFile(path.join(root, source), 'utf8')).trimEnd();
    const extension = path.posix.extname(source).slice(1);
    const language =
      { mjs: 'javascript', js: 'javascript', ts: 'typescript' }[extension] ?? extension;
    // El generador también se documenta: el cerco debe admitir backticks dentro de su código.
    const longestRun = Math.max(2, ...(code.match(/`+/g) ?? []).map((run) => run.length));
    const fence = '`'.repeat(longestRun + 1);
    await save(
      document,
      [
        `# ${path.posix.basename(source)}`,
        `[Índice general](${link(document, 'CODIGO_COMPLETO.md')}) · [Volver al módulo](./README.md) · [Abrir archivo fuente](${link(document, source)})`,
        `**Ruta:** \`${source}\`. Este documento contiene solamente el código de este archivo.`,
        'Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.',
        `${fence}${language}\n${code}\n${fence}\n`,
      ].join('\n\n'),
    );
  }),
);

const count = (directory) =>
  entries.filter((entry) => entry.document.startsWith(`${docsRoot}/${directory}/`)).length;
await Promise.all(
  [...directories].map(async (directory) => {
    const file = indexPath(directory);
    const children = [...directories]
      .filter((child) => child && path.posix.dirname(child) === (directory || '.'))
      .sort();
    const directFiles = entries.filter(
      (entry) => path.posix.dirname(entry.document) === path.posix.dirname(file),
    );
    const sections = [
      `# ${title(directory)}`,
      `[Índice general](${link(file, 'CODIGO_COMPLETO.md')})${directory ? ` · [Subir un nivel](${link(file, indexPath(path.posix.dirname(directory) === '.' ? '' : path.posix.dirname(directory)))})` : ''}`,
      'Elegí un apartado o un archivo. Cada enlace abre un documento independiente con su código completo.',
    ];
    if (children.length) {
      sections.push('## Apartados');
      sections.push(
        children
          .map(
            (child) =>
              `- [${title(child)}](${link(file, indexPath(child))}) — ${count(child)} archivos.`,
          )
          .join('\n'),
      );
    }
    if (directFiles.length) {
      sections.push('## Archivos');
      sections.push(
        directFiles
          .map((entry) => `- [${path.posix.basename(entry.source)}](${link(file, entry.document)})`)
          .join('\n'),
      );
    }
    await save(file, `${sections.join('\n\n')}\n`);
  }),
);

const categories = [
  'aplicacion',
  'modules/auth',
  'modules/patient',
  'modules/hospital',
  'shared',
  'services',
  'domain',
  'infrastructure',
  'types',
  'utils',
  'mocks',
  'configuracion',
  'herramientas',
];
await save(
  'CODIGO_COMPLETO.md',
  [
    '# Código completo · Índice por módulos',
    '**Referencia para consultar y copiar el código.** La aplicación ejecuta los archivos de `src/`. Este índice te lleva al módulo y después al archivo que necesitás, sin cargar todo el proyecto en una sola página.',
    `Se documentan **${entries.length} archivos**, cada uno en su propia página, dentro de \`docs/codigo/\`.`,
    '| Apartado | Archivos |\n| --- | ---: |\n' +
      categories
        .map(
          (directory) =>
            `| [${title(directory)}](${link('CODIGO_COMPLETO.md', indexPath(directory))}) | ${count(directory)} |`,
        )
        .join('\n'),
    '## Cómo usarlo',
    '1. Abrí el apartado que querés consultar.\n2. Elegí el módulo y su archivo.\n3. Consultá o copiá el código, o usá **Abrir archivo fuente** para editarlo.\n4. Usá **Volver al módulo** o **Índice general** para navegar.',
    '[Guía de arquitectura](./ARQUITECTURA.md) · [Instalación y uso](./README.md) · [Informe técnico](./INFORME_TECNICO.md)',
    '## Actualizar la documentación',
    'Después de modificar el código fuente, ejecutá desde la carpeta del proyecto:',
    '```powershell\nnpm.cmd run docs:code\n```',
    'El comando regenera este índice y los documentos por archivo. Editá siempre el código fuente; las copias de documentación se sobrescriben.\n',
  ].join('\n\n'),
);
console.log(
  `Documentación organizada: ${entries.length} archivos, ${directories.size} índices y un índice general breve.`,
);
````
