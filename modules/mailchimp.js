const { request } = require('https')
const { stringToBase64 } = require('./base64')

module.exports = class MailChimp {
  constructor(options) {
    this.options = {
      api_url: 'api.mailchimp.com',
      api_version: '3.0',
      account_region: getRegionFromKey(options.api_key),
      ...options
    }
  }

  fetchAllLists() {
    return new Promise(async (resolve, reject) => {
      try {
        const { api_key, api_version } = this.options
        const response = await this.getRequest({
          path: `/${api_version}/lists`
        })
        const { lists } = JSON.parse(response)
        resolve({ api_key, lists })
      } catch (error) {
        reject(error)
      }
    })
  }

  subscribeToList(details) {
    return new Promise(async (resolve, reject) => {
      try {
        let { list, api_version } = this.options
        let response = await this.postRequest({
          path: `/${api_version}/lists/${list}/members`
        }, {
            status: 'subscribed',
            ...details
          })
        let { status, title } = JSON.parse(response)
        if (status === 'subscribed') {
          resolve(title)
        } else {
          reject(title)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  unsubscribeFromList(hash) {
    return new Promise(async (resolve, reject) => {
      try {
        let { list, api_version } = this.options
        let response = await this.postRequest({
          path: `/${api_version}/lists/${list}/members/${hash}`
        }, {
            status: 'unsubscribed'
          })
        let { status, title } = JSON.parse(response)
        if (status === 'unsubscribed') {
          resolve(title)
        } else {
          reject(title)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  getRequest(options) {
    options.headers = {}
    options.method = 'GET'
    return this.request(options)
  }

  postRequest(options, body) {
    body = JSON.stringify(body)
    options.headers = {}
    options.headers['Content-Length'] = Buffer.byteLength(body)
    options.headers['Content-Type'] = 'application/json'
    options.method = 'POST'
    return this.request(options, body)
  }

  request(options, body) {
    return new Promise(async (resolve, reject) => {
      let { api_url, api_key, account_region } = this.options

      options.headers['Authorization'] = genBasicAuthFromKey(api_key)
      options.host = `${account_region}.${api_url}`

      let httpsRequest = request(options, response => {
        let data = ''

        response.on('data', chunk => {
          data += chunk
        })

        response.on('end', () => {
          resolve(data)
        })
      })

      httpsRequest.on('error', error => {
        reject(error)
      })

      httpsRequest.end(body || '')
    })
  }
}

function genBasicAuthFromKey(api_key) {
  return `Basic ${stringToBase64(`:${api_key}`)}`
}

function getRegionFromKey(api_key) {
  return api_key.split('-').slice(-1)[0]
}
