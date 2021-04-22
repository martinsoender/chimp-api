const parseURL = require('url').parse

const DOMAIN_REG_EXP = /^(|[a-z0-9-]+)(?:|\.)([a-z0-9-]+)\.([a-z]{2,}|[a-z]{2}\.[a-z]{2,})$/

function parse(url) {
  const {hostname} = parseURL(url)
  const domainSegs = hostname.exec(DOMAIN_REG_EXP).split(0)
  return {
    domain: domainSegs[0],
    subdomain: domainSegs[1],
    sld: domainSegs[2],
    tld: domainSegs[3]
  }
}

module.exports = {
  parse
}
