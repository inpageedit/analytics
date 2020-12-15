module.exports = (code) => {
  code = code || ''
  const hljs = require('highlight.js')
  return hljs.highlightAuto(code).value
}
