module.exports = (req, res) => {
  res.redirect('/api/v4/query/' + req.query.type)
}