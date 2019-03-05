const sinon = require('sinon');

module.exports = () => {
  const createTestPlan = sinon.stub();
  const createTestExecution = sinon.stub();
  const associateTestExecutionWithPlan = sinon.stub();
  const addTestsToTestExecution = sinon.stub();
  const findTestPlanBySummary = sinon.stub();
  const findTestsByLabels = sinon.stub();
  const synchroniseTestPlan = sinon.stub();
  const listTestsAgainstATestPlan = sinon.stub();
  const triggerExport = sinon.stub();
  const importTestExecutionResults = sinon.stub();

  const reset = () => {
    createTestPlan.reset();
    createTestExecution.reset();
    associateTestExecutionWithPlan.reset();
    addTestsToTestExecution.reset();
    findTestPlanBySummary.reset();
    findTestsByLabels.reset();
    synchroniseTestPlan.reset();
    listTestsAgainstATestPlan.reset();
    triggerExport.reset();
    importTestExecutionResults.reset();
  }

  return Object.freeze({
    createTestPlan,
    createTestExecution,
    associateTestExecutionWithPlan,
    addTestsToTestExecution,
    findTestPlanBySummary,
    findTestsByLabels,
    synchroniseTestPlan,
    listTestsAgainstATestPlan,
    triggerExport,
    importTestExecutionResults,

    reset
  })
}
