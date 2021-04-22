const fastify = require('fastify')({ logger: true })
const cors = require('fastify-cors')
const MailChimp = require('./modules/mailchimp')

const MC_ACCOUNTS = JSON.parse(process.env.MC_ACCOUNTS)

let mailChimpLists = []

fastify.register(cors, {
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: '*'
})

fastify.get('/', async (req, rep) => {
  rep.send('OK')
})

fastify.post('/unsubscribe', async (request, reply) => {
  let { hash, list } = request.body
  try {
    let api_key = findMailChimpListKey(list)
    let client = new MailChimp({ api_key, list })
    await client.unsubscribeFromList(hash)
    reply.code(200).send('OK')
  } catch (error) {
    reply.code(422).send()
  }
})

fastify.post('/subscribe', async (request, reply) => {
  let { member, list } = request.body
  try {
    let api_key = findMailChimpListKey(list)
    let client = new MailChimp({ api_key, list })
    await client.subscribeToList(member)
    reply.code(200).send('OK')
  } catch (error) {
    reply.code(422).send()
  }
})

// Start server once lists are fetched
fetchAllMailChimpLists(MC_ACCOUNTS).then(lists => {
  mailChimpLists = lists
  fastify.listen(3000, '0.0.0.0')
}).catch(error => {
  throw error
})

function fetchAllMailChimpLists(accounts) {
  return new Promise(async (resolve, reject) => {
    try {
      let allLists = []
      let requests = accounts.map(account => {
        let { api_key } = account
        let client = new MailChimp({ api_key })
        return client.fetchAllLists()
      })
      let responses = await Promise.all(requests)
      responses.forEach(response => {
        let { api_key, lists } = response
        lists.forEach(list => {
          let { id, name } = list
          allLists.push({ id, api_key, name })
        })
      })
      resolve(allLists)
    } catch (error) {
      reject(error)
    }
  })
}

function findMailChimpListKey(listID) {
  let { api_key } = mailChimpLists.find(list => {
    let { id } = list
    if (listID === id) {
      return list
    }
  })
  return api_key
}
