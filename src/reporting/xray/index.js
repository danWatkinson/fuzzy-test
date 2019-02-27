const jira = require('./jira');

module.exports = (config) => {

  const execute = async() => {
    const reporter = jira(config.jira);
    await reporter.sendResults(config.results);
  }

  return Object.freeze({
    execute
  })
}
