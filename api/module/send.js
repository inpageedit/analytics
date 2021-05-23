function _return() {
  let version
  try {
    version = require('../../package.json').version
  } catch (err) {}
  return {
    status: true,
    msg: [],
    about: {
      name: 'InPageEdit Analysis',
      version,
      author: '机智的小鱼君 <dragon-fish@qq.com>',
    },
    server: {
      backend: 'Vercel, serverless Node.js API',
      datacenter: 'MongoDB Atlas, AWS / Oregon (us-west-2)',
    },
  }
}

function prettyPrint({ title, query, content = '', status = 200 }) {
  // title
  title = `${title ? title + ' | ' : ''}API 结果 | InPageEdit Analysis API`

  // query
  if (query) {
    try {
      query = JSON.stringify(query, null, 2)
    } catch (e) {}
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
    content = JSON.stringify(content, null, 2)
  } catch (e) {}

  content = `
<section class="result-area">
  <h2>返回结果</h2>
  <pre class="hljs">${content}</pre>
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
    <header><h1>${title}</h1></header>
    <main>
      <p>小贴士：这是 API 输出结果美化后的结果，使结果更易读。不要在生产环境使用 <code>pretty</code> 参数～</p>
      ${query}
      ${content}
    </main>
    <footer>
      <p>&copy; 2020 InPageEdit Tech.</p>
    </footer>
    <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.3.1/build/highlight.min.js"></script>
    <script>!(()=>{
      const blocks = document.getElementsByClassName('hljs')
      for (item of blocks) {
        if (item.innerText.length > 100000) return console.warn('区块内容大于 100000 字符，停止hljs渲染', item)
        hljs.highlightBlock(item)
      }
    })()</script>
  </body>
</html>
  `
  return html
}

function send({ title = '', req, res, content, status = 200 }) {
  content = {
    ..._return(),
    ...content,
  }
  if (req.query && req.query.pretty) {
    content = prettyPrint({ title, query: req.query, content, status })
  }
  return res.status(status).send(content)
}

module.exports = {
  _return,
  prettyPrint,
  send,
}
