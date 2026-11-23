/* Sets the colour theme before the page paints, so there is no flash. Kept as a file because the Content Security Policy blocks inline scripts. */
(function () {
  var t = null
  try { t = localStorage.getItem('wb-theme') } catch (e) {}
  if (t !== 'light' && t !== 'dark') t = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', t)
})()
