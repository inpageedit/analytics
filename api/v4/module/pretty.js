module.exports = (code) => {
  code = code || ''
  if (typeof code === 'object') code = JSON.stringify(code, null, 2)
  const hljs = require('highlight.js')
  code = hljs.highlightAuto(code).value
  var html = `
<html>
  <head>
    <title>Pretty printed result | InPageEdit Analysis API</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@9.12.0/styles/solarized-light.css">
  </head>
  <body>
    <header><h1>Pretty printed result</h1></header>
    <main>
      <pre><code>${code}<code></pre>
    </main>
  </body>
</html>
  `
  return html
}
