// Assemble client.js from the readable source plus the vendored KaTeX UMD build.
//
//   node build.mjs
//
// `client.js` is generated — edit `src/client.source.js` instead, then rebuild.
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const here = fileURLToPath(new URL('.', import.meta.url))
const sourcePath = here + 'src/client.source.js'
const katexPath = here + 'third_party/katex.min.js'
const outPath = here + 'client.js'

const MARKER = '/*__KATEX_UMD__*/'
const source = fs.readFileSync(sourcePath, 'utf8')
if (!source.includes(MARKER)) throw new Error(`build: ${sourcePath} has no ${MARKER} marker`)

const KATEX_VERSION = '0.16.22'
const katex = fs.readFileSync(katexPath, 'utf8').trimEnd()
const header = [
  '/* GENERATED FILE — edit src/client.source.js and run `node build.mjs`.',
  ` * Bundles: this plugin (MIT) + KaTeX ${KATEX_VERSION} (MIT, https://katex.org,`,
  ' * see third_party/katex-LICENSE.txt).',
  ' */',
  '',
].join('\n')

const body = source.replace(MARKER, () => katex)
fs.writeFileSync(outPath, header + body)
console.log(`build: wrote ${outPath} (${(header + body).length} bytes, katex ${katex.length} bytes)`)
