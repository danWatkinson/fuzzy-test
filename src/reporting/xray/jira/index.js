const archiver = require('archiver');
const fs = require('fs');

const jiraAPI = require('../../../jiraAPI');

module.exports = (config) => {
  const api = jiraAPI(config);

  const sendResults = async(results) => {
    await zipResults(results);
    await api.importTestExecutionResults(results.temporaryZip);
  }

  const zipResults = async(results) => {
    const {reportsDir, temporaryZip} = results;

    return new Promise( (resolve, reject) => {
      const output = fs.createWriteStream(temporaryZip);
      const archive = archiver('zip');

      output.on('close', function () {
        resolve();
      });

      archive.on('error', function(err){
        reject(err);
      });

      archive.pipe(output);
      archive.glob(`${reportsDir}/*.json`);

      archive.finalize();
    });
  };

  return Object.freeze({
    sendResults
  });
}
