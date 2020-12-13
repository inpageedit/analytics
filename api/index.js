module.exports = (req, res) => {
  res.send({
    msg: [
      'hello, world'
    ],
    api: {
      v4: '/api/v4'
    }
  })
}