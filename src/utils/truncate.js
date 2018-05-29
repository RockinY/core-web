// @flow
function truncate (str: string, length: number) {
  if (str.length <= length) {
    return str
  }
  var substring = str.substr(0, length)
  return (
    substring.substr(0, substring.lastIndexOf(' ')).replace(/\n/, ' ') + '...'
  )
}

module.exports = truncate
