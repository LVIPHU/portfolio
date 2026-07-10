// Sinh cfg.dtsPropsFor từ SOURCE tsx của apps/2025 (app không ship .d.ts).
// Dùng ts-morph + tsconfig thật của app để flatten props (kể cả VariantProps của cva).
// Chỉ lấy props KHAI BÁO trong repo (bỏ ~250 attr DOM kế thừa) + children/className.
// Chạy: node .design-sync/extract-props.mjs  → in JSON {Name: "prop?: type; ..."}
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const require = createRequire(resolve('.ds-sync/package.json'))
const { Project, ts } = require('ts-morph')

const cfg = JSON.parse(readFileSync('.design-sync/config.json', 'utf8'))
const APP = resolve('apps/2025')
const project = new Project({
  tsConfigFilePath: join(APP, 'tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
})
const files = Object.values(cfg.componentSrcMap).map((p) => join(APP, p))
project.addSourceFilesAtPaths(files)
project.resolveSourceFileDependencies()

const REPO = resolve('.').replace(/\\/g, '/').toLowerCase()
const SKIP = new Set(['key', 'ref'])
const KEEP_INHERITED = new Set(['children', 'className'])
const FMT = ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope | ts.TypeFormatFlags.InTypeAlias

function linesFor(propsType, anchor) {
  const lines = []
  for (const sym of propsType.getProperties()) {
    const name = sym.getName()
    if (SKIP.has(name) || !/^[A-Za-z_$][\w$]*$/.test(name)) continue
    const dp = sym.getDeclarations()[0]?.getSourceFile().getFilePath() ?? ''
    const own = dp.replace(/\\/g, '/').toLowerCase().startsWith(REPO) && !dp.includes('node_modules')
    if (!own && !KEEP_INHERITED.has(name)) continue
    let t
    try {
      t = sym.getTypeAtLocation(anchor).getText(anchor, FMT)
    } catch {
      continue
    }
    t = t.replace(/import\([^)]*\)\./g, '')
    if (t.length > 170) t = t.slice(0, 167) + '…'
    const opt = sym.compilerSymbol.flags & ts.SymbolFlags.Optional ? '?' : ''
    lines.push(`${name}${opt}: ${t}`)
  }
  return lines
}

const out = {}
let errs = 0
for (const [name, rel] of Object.entries(cfg.componentSrcMap)) {
  const sf = project.getSourceFile(join(APP, rel))
  if (!sf) continue
  try {
    let propsType = null
    let anchor = sf
    const decl = sf.getExportedDeclarations().get(name)?.[0]
    if (decl) {
      const sigs = decl.getType().getCallSignatures()
      const p0 = sigs[0]?.getParameters()[0]
      if (p0) {
        propsType = p0.getTypeAtLocation(decl)
        anchor = decl
      }
    }
    if (!propsType) {
      const named = sf.getInterface(`${name}Props`) ?? sf.getTypeAlias(`${name}Props`)
      if (named) {
        propsType = named.getType()
        anchor = named
      }
    }
    if (!propsType) continue
    const lines = linesFor(propsType, anchor)
    if (lines.length) out[name] = lines.join('; ')
  } catch {
    errs++
  }
}
console.log(JSON.stringify(out, null, 2))
console.error(`extracted: ${Object.keys(out).length}/${Object.keys(cfg.componentSrcMap).length} (errors: ${errs})`)
