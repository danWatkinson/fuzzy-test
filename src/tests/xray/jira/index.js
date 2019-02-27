const extract = require('extract-zip')
const fs = require('fs');
const fse = require('fs-extra');
const hyperdiff = require('hyperdiff');
const path = require('path');
const prependFile = require('prepend-file')

const jiraAPI = require('../../../jiraAPI');

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


  return Object.freeze({
    synchronise,
    prepareTestExecution,
    exportFeatures
  });
}
