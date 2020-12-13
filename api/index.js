module.exports = (req, res) => {
  res.send({
    msg: [
      'hello, world'
    ],
    api: {
      wjghj: 'https://api.wjghj.cn/inpageedit',
      v4: '/api/v4'
    }
  })
}