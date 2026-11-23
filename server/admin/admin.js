// Content panel: news posts and vlogs, job openings, and the enquiries and applications received.
const $ = (s, el = document) => el.querySelector(s)
const $$ = (s, el = document) => [...el.querySelectorAll(s)]
const CATEGORY = { announcement: 'Company announcement', launch: 'Product launch', industry: 'Industry update', exhibition: 'Exhibition', technical: 'Technical development', insight: 'Engineering insight', event: 'Company event' }
const DEFAULT_IMAGE = { announcement: 'calibration-lab', launch: 'instrument-poster', industry: 'photo-metals', exhibition: 'hero', technical: 'macro', insight: 'pipes', event: 'tanks' }
let siteImages = []
let state = { posts: [], jobs: [] }

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const fmtDate = (d) => (d ? new Date(d + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '')
const today = () => new Date().toISOString().slice(0, 10)

async function api(path, opts = {}) {
  const res = await fetch('/api/admin' + path, { credentials: 'same-origin', ...opts, headers: { ...(opts.body && !(opts.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...opts.headers } })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401 && path !== '/login') { showLogin(); throw new Error('Please sign in again.') }
  if (!res.ok) { const e = new Error(data.error || 'Something went wrong. Please try again.'); e.errors = data.errors; throw e }
  return data
}

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show')
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2600)
}

/* ---------- Sign in ---------- */
function showLogin() { $('#app').hidden = true; $('#who').hidden = true; $('#login').hidden = false; $('#loginForm [name=username]').focus() }
async function start() {
  const me = await fetch('/api/admin/me').then((r) => r.json().then((j) => ({ status: r.status, ...j }))).catch(() => ({ status: 0 }))
  if (me.status === 503) { $('#off').hidden = false; $('#off').textContent = me.error; return }
  if (!me.ok) return showLogin()
  $('#login').hidden = true; $('#app').hidden = false; $('#who').hidden = false; $('#whoName').textContent = `Signed in as ${me.user}`
  $('#postForm [name=category]').innerHTML = me.categories.map((c) => `<option value="${c}">${esc(CATEGORY[c] ?? c)}</option>`).join('')
  $('#jobForm [name=type]').innerHTML = me.jobTypes.map((t) => `<option>${esc(t)}</option>`).join('')
  siteImages = (await api('/site-images')).items
  await Promise.all([loadPosts(), loadJobs()])
}
$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const f = new FormData(e.target)
  $('#loginError').textContent = ''
  try {
    await api('/login', { method: 'POST', body: JSON.stringify({ username: f.get('username'), password: f.get('password') }) })
    e.target.reset(); start()
  } catch (err) { $('#loginError').textContent = err.message === 'rate_limited' ? 'Too many tries. Please wait 15 minutes.' : err.message }
})
$('#logout').addEventListener('click', async () => { await api('/logout', { method: 'POST' }).catch(() => {}); showLogin() })

/* ---------- Tabs ---------- */
$$('.tabs button').forEach((b) => b.addEventListener('click', () => {
  $$('.tabs button').forEach((x) => x.classList.toggle('on', x === b))
  $$('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== b.dataset.tab })
  if (b.dataset.tab === 'enquiries') loadSubmissions('enquiries', '#enqList')
  if (b.dataset.tab === 'careers') loadSubmissions('careers', '#carList')
}))

/* ---------- Helpers for forms ---------- */
const imageUrl = (v, category) => {
  const name = !v ? DEFAULT_IMAGE[category] : v.startsWith('site:') ? v.slice(5) : null
  if (name) return siteImages.find((i) => i.name === name)?.url ?? ''
  return v
}
function fill(form, item) {
  for (const el of form.elements) {
    if (!el.name) continue
    if (el.type === 'checkbox') el.checked = !!item[el.name]
    else el.value = item[el.name] ?? ''
  }
}
function read(form) {
  const o = {}
  for (const el of form.elements) if (el.name) o[el.name] = el.type === 'checkbox' ? el.checked : el.value
  return o
}
function showErrors(form, box, err) {
  $$('.field-error', form).forEach((x) => x.remove())
  box.textContent = err.errors ? 'Please check the highlighted fields.' : err.message
  for (const [k, msg] of Object.entries(err.errors ?? {})) {
    const el = form.elements[k]
    const target = el?.type === 'hidden' ? el.parentElement : el?.closest('label')
    target?.insertAdjacentHTML('beforeend', `<span class="field-error">${esc(msg)}</span>`)
  }
}
const status = (item) => (item.published ? (item.closingDate && item.closingDate < today() ? '<span class="pill ended">Closed</span>' : '<span class="pill live">On the website</span>') : '<span class="pill draft">Draft</span>')

/* ---------- Posts ---------- */
const postForm = $('#postForm')
let editingPost = null
async function loadPosts() {
  state.posts = (await api('/posts')).items
  $('#postList').innerHTML = state.posts.length
    ? state.posts.map((p) => `<div class="item"><img src="${esc(imageUrl(p.image, p.category))}" alt="">
        <div class="grow"><h3>${esc(p.title)}${p.video ? ' ▶' : ''}</h3><div class="meta">${status(p)} ${esc(CATEGORY[p.category])} · ${fmtDate(p.date)}${p.updatedBy ? ` · last changed by ${esc(p.updatedBy)}` : ''}</div></div>
        ${p.published ? `<a class="btn ghost small" href="/news/${encodeURIComponent(p.id)}" target="_blank" rel="noopener">View</a>` : ''}
        <button class="btn ghost small" data-edit="${esc(p.id)}">Edit</button><button class="btn danger small" data-del="${esc(p.id)}">Delete</button></div>`).join('')
    : '<div class="empty">No posts yet. Click <b>+ New post</b> to write the first one.</div>'
}
function openPost(item) {
  editingPost = item?.id ?? null
  $('#postFormTitle').textContent = item ? 'Edit post' : 'New post'
  fill(postForm, item ?? { category: 'announcement', date: today(), published: true })
  $('#postError').textContent = ''; $$('.field-error', postForm).forEach((x) => x.remove())
  $('#siteImages').hidden = true; $('#videoInfo').textContent = ''
  updatePreview()
  postForm.hidden = false; $('#postList').hidden = true; $('#newPost').hidden = true
  postForm.elements.title.focus()
}
function closePost() { postForm.hidden = true; $('#postList').hidden = false; $('#newPost').hidden = false }
function updatePreview() {
  const v = postForm.elements.image.value
  const url = imageUrl(v, postForm.elements.category.value)
  $('#imgPreview').hidden = !url; $('#imgPreview').src = url
  $('#clearImage').hidden = !v
}
$('#newPost').addEventListener('click', () => openPost(null))
postForm.elements.category.addEventListener('change', updatePreview)
$('#clearImage').addEventListener('click', () => { postForm.elements.image.value = ''; updatePreview() })
$('#pickImage').addEventListener('click', () => {
  const g = $('#siteImages')
  g.hidden = !g.hidden
  g.innerHTML = siteImages.map((i) => `<button type="button" data-img="${esc(i.name)}" title="${esc(i.name)}"><img src="${esc(i.url)}" alt="${esc(i.name)}"></button>`).join('') || '<p class="muted">The standard pictures appear here once the website is built.</p>'
})
$('#siteImages').addEventListener('click', (e) => {
  const b = e.target.closest('[data-img]'); if (!b) return
  postForm.elements.image.value = 'site:' + b.dataset.img
  $('#siteImages').hidden = true; updatePreview()
})
async function uploadFile(file) {
  const f = new FormData(); f.append('file', file)
  return api('/upload', { method: 'POST', body: f })
}
$('#imgFile').addEventListener('change', async (e) => {
  const file = e.target.files[0]; if (!file) return
  toast('Uploading picture…')
  try {
    const r = await uploadFile(file)
    if (r.kind !== 'image') throw new Error('That file is a video. Use “Upload a video” below.')
    postForm.elements.image.value = r.url; updatePreview(); toast('Picture uploaded')
  } catch (err) { $('#postError').textContent = err.message }
  e.target.value = ''
})
$('#videoFile').addEventListener('change', async (e) => {
  const file = e.target.files[0]; if (!file) return
  $('#videoInfo').textContent = 'Uploading… please keep this page open.'
  try {
    const r = await uploadFile(file)
    if (r.kind !== 'video') throw new Error('That file is a picture. Use “Upload a picture” above.')
    postForm.elements.video.value = r.url; $('#videoInfo').textContent = 'Video uploaded ✓'
  } catch (err) { $('#videoInfo').textContent = ''; $('#postError').textContent = err.message }
  e.target.value = ''
})
postForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const body = JSON.stringify(read(postForm))
  try {
    await api(editingPost ? `/posts/${encodeURIComponent(editingPost)}` : '/posts', { method: editingPost ? 'PUT' : 'POST', body })
    toast(read(postForm).published ? 'Saved. It is on the website now.' : 'Saved as a draft.')
    closePost(); loadPosts()
  } catch (err) { showErrors(postForm, $('#postError'), err) }
})
$('#postList').addEventListener('click', async (e) => {
  const ed = e.target.closest('[data-edit]'); const del = e.target.closest('[data-del]')
  if (ed) openPost(state.posts.find((p) => p.id === ed.dataset.edit))
  if (del && confirm('Delete this post? This cannot be undone. (To hide it for now, edit it and untick “Show on the website”.)')) {
    await api(`/posts/${encodeURIComponent(del.dataset.del)}`, { method: 'DELETE' }); toast('Post deleted'); loadPosts()
  }
})

/* ---------- Jobs ---------- */
const jobForm = $('#jobForm')
let editingJob = null
async function loadJobs() {
  state.jobs = (await api('/jobs')).items
  $('#jobList').innerHTML = state.jobs.length
    ? state.jobs.map((j) => `<div class="item"><div class="grow"><h3>${esc(j.title)}</h3><div class="meta">${status(j)} ${esc(j.location)} · ${esc(j.type)}${j.closingDate ? ` · closes ${fmtDate(j.closingDate)}` : ''}</div></div>
        <button class="btn ghost small" data-edit="${esc(j.id)}">Edit</button><button class="btn danger small" data-del="${esc(j.id)}">Delete</button></div>`).join('')
    : '<div class="empty">No job openings. Click <b>+ New job opening</b> to add one.</div>'
}
function openJob(item) {
  editingJob = item?.id ?? null
  $('#jobFormTitle').textContent = item ? 'Edit job opening' : 'New job opening'
  fill(jobForm, item ?? { type: 'Full-time', published: true })
  $('#jobError').textContent = ''; $$('.field-error', jobForm).forEach((x) => x.remove())
  jobForm.hidden = false; $('#jobList').hidden = true; $('#newJob').hidden = true
  jobForm.elements.title.focus()
}
function closeJob() { jobForm.hidden = true; $('#jobList').hidden = false; $('#newJob').hidden = false }
$('#newJob').addEventListener('click', () => openJob(null))
jobForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  try {
    await api(editingJob ? `/jobs/${encodeURIComponent(editingJob)}` : '/jobs', { method: editingJob ? 'PUT' : 'POST', body: JSON.stringify(read(jobForm)) })
    toast(read(jobForm).published ? 'Saved. It is on the Careers page now.' : 'Saved as a draft.')
    closeJob(); loadJobs()
  } catch (err) { showErrors(jobForm, $('#jobError'), err) }
})
$('#jobList').addEventListener('click', async (e) => {
  const ed = e.target.closest('[data-edit]'); const del = e.target.closest('[data-del]')
  if (ed) openJob(state.jobs.find((j) => j.id === ed.dataset.edit))
  if (del && confirm('Delete this job opening? This cannot be undone.')) {
    await api(`/jobs/${encodeURIComponent(del.dataset.del)}`, { method: 'DELETE' }); toast('Job opening deleted'); loadJobs()
  }
})
$$('[data-cancel]').forEach((b) => b.addEventListener('click', () => { closePost(); closeJob() }))

/* ---------- Submissions ---------- */
async function loadSubmissions(kind, sel) {
  const { items } = await api(`/submissions/${kind}`)
  $(sel).innerHTML = items.length
    ? items.map((r) => `<details><summary>${esc(r.name)}${r.company ? `, ${esc(r.company)}` : ''} · ${esc(r.type ?? r.area ?? '')}${r.role ? ` · ${esc(r.role)}` : ''} <span class="muted">· ${new Date(r.at).toLocaleString()} · ${esc(r.ref)}</span></summary>
        <p><b>Email:</b> <a href="mailto:${esc(r.email)}">${esc(r.email)}</a>${r.phone ? ` · <b>Phone:</b> ${esc(r.phone)}` : ''}${r.subject ? ` · <b>About:</b> ${esc(r.subject)}` : ''}</p>
        <p>${esc(r.message)}</p>${r.cv ? `<p><a class="btn ghost small" href="/api/admin/cv/${encodeURIComponent(r.cv)}">Download CV</a></p>` : ''}</details>`).join('')
    : '<div class="empty">Nothing received yet.</div>'
}

start()
