const archiver = require('archiver');
const fs = require('fs');

const jiraAPI = require('../../../jiraAPI');
const zip = require('./zip');

module.exports = (config) => {
  const api = jiraAPI(config);

  const sendResults = async(results) => {
    const {reportsDir, temporaryZip} = results;

    await zip(`${reportsDir}/*.json`, temporaryZip);
    await api.importTestExecutionResults(results.temporaryZip);
  }

  return Object.freeze({
    sendResults
  });
}
