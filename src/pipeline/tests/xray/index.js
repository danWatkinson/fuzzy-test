const stepdefinitions = require('./stepdefinitions');
const jira = require('./jira');

module.exports = (config) => {

  const execute = async() => {
    await stepdefinitions(config.stepdefinitions);

    const features = jira(config.jira);
    const testPlanKey = await features.synchronise(config.testplan);
    const testExecutionKey = await features.prepareTestExecution(config.testplan);
    await features.exportFeatures(testPlanKey, testExecutionKey, config.target);
  }

  return Object.freeze({
    execute
  })
}
