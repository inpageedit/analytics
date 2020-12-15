module.exports = (code) => {
  code = code || ''
  if (typeof code === 'object') code = JSON.stringify(code, null, 2)
  const hljs = require('highlight.js')
  return hljs.highlightAuto(code).value
}
