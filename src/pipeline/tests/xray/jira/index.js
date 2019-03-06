const fse = require('fs-extra');
const hyperdiff = require('hyperdiff');

const jiraAPI = require('../../../../jiraAPI');
const unzip = require('./unzip');
const prependTestExecutionIdToAllFeatures = require('./prependTestExecutionIdToAllFeatures');

module.exports = (config) => {
  const api = jiraAPI(config);

  let testPlanKey;
  let testExecutionKey;
  let testKeys = [];

  const synchronise = async (testplan) => {
    const {summary, project, tribe, squad, components, labels} = testplan;
    testPlanKey = await locateOrCreate(testplan);
    testKeys = await synchroniseTestsWithinTestPlan(testPlanKey, labels);

    return testPlanKey;
  }

  const prepareTestExecution = async(testplan) => {
    testExecutionKey = await api.createTestExecution(testplan);
    await api.associateTestExecutionWithPlan(testExecutionKey, testPlanKey);
    await api.addTestsToTestExecution(testExecutionKey, testKeys);

    return testExecutionKey;
  }

  const exportFeatures = async(testPlanKey, testExecutionKey, target) => {
    fse.ensureDirSync(target.unzipTarget);
    await api.triggerExport(testPlanKey, target.temporaryZip);
    await unzip(target.temporaryZip, target.unzipTarget);
    await prependTestExecutionIdToAllFeatures(target.unzipTarget, testExecutionKey);
  }

  const locateOrCreate = async(testplan) => {
    let key = await api.findTestPlanBySummary(testplan.summary);
    if (!key) {
      key = await api.createTestPlan(testplan);
    }
    return key;
  }

  const synchroniseTestsWithinTestPlan = async(testPlanKey, labels) => {
    const testsWithCorrectLabels = await api.findTestsByLabels(labels);
    const testsAlreadyInTestPlan = await api.listTestsAgainstATestPlan(testPlanKey);
    const delta = hyperdiff(testsAlreadyInTestPlan, testsWithCorrectLabels);
    await api.synchroniseTestPlan(testPlanKey, delta);

    return testsWithCorrectLabels;
  }

  return Object.freeze({
    synchronise,
    prepareTestExecution,
    exportFeatures
  });
}
