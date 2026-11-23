import { mkdirSync, appendFileSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import path from 'node:path'

/** Append-only JSON Lines log per form, plus a folder for CVs. Simple to back up and to import into a CRM. */
export function createStore(dir) {
  mkdirSync(path.join(dir, 'cv'), { recursive: true })
  return {
    cvDir: path.join(dir, 'cv'),
    /** Every record of one form, oldest first. */
    read(kind) {
      const f = path.join(dir, `${kind}.jsonl`)
      if (!existsSync(f)) return []
      return readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
    },
    newRef(prefix = 'WB') {
      const d = new Date()
      const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`
      return `${prefix}-${ymd}-${randomBytes(3).toString('hex').toUpperCase()}`
    },
    save(kind, record) {
      appendFileSync(path.join(dir, `${kind}.jsonl`), JSON.stringify(record) + '\n', { mode: 0o600 })
    },
    saveCv(ref, ext, buffer) {
      const name = `${ref}.${ext}`
      writeFileSync(path.join(dir, 'cv', name), buffer, { mode: 0o600 })
      return name
    },
  }
}
