const fs = require('fs');
const path = require('path');
const axios = require('axios');
const extract = require('extract-zip')

const prependFile = require('prepend-file')

module.exports = (config) => {

  const triggerExport = async(url, pathToPutZip) => {
    const writer = fs.createWriteStream(pathToPutZip)

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
  }

  const unzip = async(zip, targetPath) => {
    return new Promise( (resolve, reject) => {
      extract(zip, {dir: path.resolve(targetPath)}, function (err) {
       if (err) reject(err);
       resolve();
      })
    });
  }

  const prependTestExecutionIdToAllFeatures = (locationOfAllFeatures, executionId) => {
    const featureFiles = fs.readdirSync(locationOfAllFeatures)
               .filter( filename => filename.endsWith('.feature') )
               .map( filename => path.join(locationOfAllFeatures, filename ) );

    for(var i=0; i<featureFiles.length; i++) {
      prependFile.sync(featureFiles[i], `@${executionId}\n`)
    }
  }


  const exportTestPlan = async (testPlanKey, testExecutionKey) => {
    const {hostname, exportZip, unzipTarget} = config;
    const url = `${hostname}/rest/raven/1.0/export/test?keys=${testPlanKey}&fz=true`

    await triggerExport(url, exportZip);
    await unzip(exportZip, unzipTarget);
    await prependTestExecutionIdToAllFeatures(unzipTarget, testExecutionKey);
  }

  return Object.freeze({
    exportTestPlan
  })
}
