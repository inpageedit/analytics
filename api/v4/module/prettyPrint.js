module.exports = ({ title, query, result = '', status = 200 }) => {

  // title
  var title1 = 'API 结果 | InPageEdit Analysis API'
  if (title) {
    title = title + ' | ' + title1
  } else {
    title = title1
  }

  // query
  if (query) {
    try {
      query = JSON.stringify(query, null, 2)
    } catch (e) { }
    query = `
<section class="query-area">
  <h2>请求参数/请求体</h2>
  <pre class="hljs">${query}</pre>
</section>
    `
  } else {
    query = ''
  }

  // result
  try {
    result = JSON.stringify(result, null, 2)
  } catch (e) { }

  result = `
<section class="result-area">
  <h2>返回结果</h2>
  <pre class="hljs">${result}</pre>
</section>
    `

  // final html
  var html = `
<html lang="zh-CN">
  <head>
    <title>${title}</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@9.12.0/styles/solarized-light.css">
  </head>
  <body class="pretty-print api-result status-${status}">
    <header><h1>API 输出结果</h1></header>
    <main>
      ${query}
      ${result}
    </main>
    <footer>
      <p>小贴士：这是 API 输出结果美化后的结果，使结果更易读。不要在生产环境使用 <code>pretty</code> 参数～</p>
      <p>&copy; 2020 InPageEdit Tech.</p>
    </footer>
    <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.3.1/build/highlight.min.js"></script>
    <script>!(()=>{
      const blocks = document.getElementsByClassName('hljs')
      for (item of blocks) {
        hljs.highlightBlock(item)
      }
    })()</script>
  </body>
</html>
  `
  return html
}
