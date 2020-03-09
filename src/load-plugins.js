/* eslint {"no-redeclare": "off"} */
var js = KVoteFormData.pluginJs, css = KVoteFormData.pluginCss
for (var i = 0; i < js.length; i++) {
  var el = document.createElement('script')
  el.src = js[i]
  document.head.appendChild(el)
}
for (var i = 0; i < css.length; i++) {
  var el = document.createElement('link')
  el.href = css[i]
  el.rel = 'stylesheet'
  el.type = 'text/css'
  document.head.appendChild(el)
}
