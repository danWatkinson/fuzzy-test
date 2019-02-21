const fs = require('fs')
const path = require('path')
const axios = require('axios')

module.exports = (config) => {
  const {host, output} = config.config.tests.xray.features;

  const baseURL = host + '/rest/raven/1.0/export/test'

  const execute = async (testPlanKey) => {
    const url = baseURL + '?keys=' + testPlanKey;

    const writer = fs.createWriteStream(output)

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      auth: config
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
     writer.on('finish', resolve)
     writer.on('error', reject)
    })
  }

  return Object.freeze({
    execute
  })
}
