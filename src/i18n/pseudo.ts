/** Pseudo-localisation for QA: accents every letter and pads strings by ~30%, keeping {placeholders} and [[markers]] intact. */
const MAP: Record<string, string> = {
  a: 'á', b: 'ƀ', c: 'ç', d: 'ď', e: 'é', f: 'ƒ', g: 'ĝ', h: 'ĥ', i: 'í', j: 'ĵ', k: 'ķ', l: 'ļ', m: 'ɱ', n: 'ñ', o: 'ö', p: 'þ', q: 'ǫ', r: 'ŕ', s: 'š', t: 'ţ', u: 'ü', v: 'ṽ', w: 'ŵ', x: 'ẋ', y: 'ý', z: 'ž',
  A: 'Á', B: 'Ɓ', C: 'Ç', D: 'Ď', E: 'É', F: 'Ƒ', G: 'Ĝ', H: 'Ĥ', I: 'Í', J: 'Ĵ', K: 'Ķ', L: 'Ļ', M: 'Ṁ', N: 'Ñ', O: 'Ö', P: 'Þ', Q: 'Ǫ', R: 'Ŕ', S: 'Š', T: 'Ţ', U: 'Ü', V: 'Ṽ', W: 'Ŵ', X: 'Ẋ', Y: 'Ý', Z: 'Ž',
}
function pseudoString(s: string) {
  const out = s.replace(/(\{[^}]+\}|\[\[[^\]]+\]\])|([A-Za-z])/g, (_m, keep, ch) => keep ?? MAP[ch] ?? ch)
  return '⟦' + out + '⟧'
}
export function pseudoize<T>(v: T): T {
  if (typeof v === 'string') return pseudoString(v) as T
  if (Array.isArray(v)) return v.map(pseudoize) as T
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, pseudoize(x)])) as T
  return v
}
