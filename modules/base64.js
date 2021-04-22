function objectToBase64(str) {
  return stringToBase64(JSON.stringify(str))
}

function base64ToObject(str) {
  return JSON.parse(base64ToString(str))
}

function base64ToString(str) {
  return Buffer.from(str, 'base64').toString('utf8')
}

function stringToBase64(str) {
  return Buffer.from(str, 'utf8').toString('base64')
}

module.exports = {
  base64ToObject,
  base64ToString,
  objectToBase64,
  stringToBase64
}
