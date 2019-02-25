const fs = require('fs');
const path = require('path');
const axios = require('axios');
var extract = require('extract-zip')

module.exports = (config) => {
  const {hostname, exportZip, unzipTarget} = config;

  const baseURL = `${hostname}/rest/raven/1.0/export/test`

  const execute = async (testPlanKey) => {
    const url = `${baseURL}?keys=${testPlanKey}&fz=true`;
    const writer = fs.createWriteStream(exportZip)

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      auth: config
    });

    response.data.pipe(writer)

    await new Promise((resolve, reject) => {
     writer.on('finish', resolve)
     writer.on('error', reject)
   });

    return new Promise( (resolve, reject) => {
      extract(exportZip, {dir: path.resolve(unzipTarget)}, function (err) {
       if (err) reject(err);
       resolve();
      })
    });

  }

  return Object.freeze({
    execute
  })
}
