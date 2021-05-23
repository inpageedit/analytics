const Time = (function() {
  this.now = Date.now()
  this.second = 1000
  this.minute = 60 * this.second
  this.hour = 60 * this.minute
  this.day = 24 * this.hour
  this.year = 365 * this.day

  this.dayAgo = (day, from) => {
    from = from || this.now
    return new Date(from).getTime() - this.day * day
  }

  this.ymd = (time) => {
    time = time || this.now
    const date = new Date()
    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`
    const day = `0${date.getDate()}`
    return `${year}-${month.substring(month.length - 2)}-${day.substring(
      day.length - 2
    )}`
  }

  return this
})()

function getDateArr(from, to) {
  const arr = []
  for (let i = from; i < to; i = i + Time.day) {
    console.log(i)
    arr.push(Time.ymd(i))
  }
  return arr
}

// module.exports = async (req, res) => {
//   let { from, to } = req.query
//   if (!from) from = Time.
// }

console.log(new Date(Time.dayAgo(10)))
console.log(getDateArr(Time.dayAgo(10), Time.now))
