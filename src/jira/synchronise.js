const hyperdiff = require('hyperdiff');

const apiBuilder = require('./api/apiBuilder');

module.exports = async (options) => {

  const api = apiBuilder(options);

  let key = await api.findTestPlanBySummary();

  if (!key) {
    key = await api.createTestPlan();
  }

  const testsWithCorrectLabels = await api.findTestsByLabels();

  const testsAlreadyInTestPlan = await api.listTestsAgainstATestPlan(key);

  const delta = hyperdiff(testsAlreadyInTestPlan, testsWithCorrectLabels);

  await api.synchroniseTestPlan(key, delta);

}
