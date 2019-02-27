const stepdefinitions = require('./stepdefinitions');
const jira = require('./jira');

module.exports = (config) => {

  const execute = async() => {
    stepdefinitions(config.stepdefinitions).executePlugins();

    const features = jira(config.jira)
    const testPlanKey = await features.synchronise(config.testplan)
    const testExecutionKey = await features.prepareTestExecution(config.testplan)
    await features.exportFeatures(testPlanKey, testExecutionKey, config.target);
  }

  return Object.freeze({
    execute
  })
}
