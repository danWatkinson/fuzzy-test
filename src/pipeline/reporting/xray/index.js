const jira = require('./jira');

module.exports = (config) => {

  const execute = () => {
    return jira(config.jira)
            .sendResults(config.results);
  }

  return Object.freeze({
    execute
  })
}
