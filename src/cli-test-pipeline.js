#!/usr/bin/env node
const options = require('commander');
const path = require('path');
const fse = require('fs-extra');

const clone = require('./git/clone');
const api = require('./jira/api/apiBuilder');
const exportTestPlan = require('./jira/exportTestPlan/exportTestPlan');
const synchronise = require('./jira/synchronise.js')
const prepareDockerImage = require('./build/prepareDockerImage');
const createRunnerScript = require('./build/createRunnerScript');
const executeTestsInDocker = require('./build/executeTestsInDocker');
const importCucumberResults = require('./jira/importResults/importCucumberResults');

const configParser = require('./configuration/configParser');

options
  .version('0.1.0')
  .option('-u, --username <string>', 'jira username')
  .option('-p, --password <string>', 'jira password')
  .option('-f, --config <string>', 'location of config file')
  .option('-b, --buildIdentifier <string>', 'unique identifier of this execution')

  .option('-x, --perfectoToken <string>', 'perfecto security token')

  .parse(process.argv);

const config = configParser(options);

async function go() {

  // get the tests..
  await clone(config.tests.xray.stepdefs.git).performClone();
  await synchronise(config.tests.xray.features);
  fse.ensureDirSync(config.tests.xray.features.unzipTarget);
  const testPlanKey = await api(config.tests.xray.features).findTestPlanBySummary();
  const testExecutionKey = await api(config.tests.xray.features).createTestExecution();
  await api(config.tests.xray.features).associateTestExecutionWithPlan(testExecutionKey, testPlanKey);
  const testsWithCorrectLabels = await api(config.tests.xray.features).findTestsByLabels();
  await api(config.tests.xray.features).addTestsToTestExecution(testExecutionKey, testsWithCorrectLabels);
  await exportTestPlan(config.tests.xray.features).exportTestPlan(testPlanKey, testExecutionKey);

  // execute the tests..
  await prepareDockerImage(config.executor.docker);
  await createRunnerScript(config.executor.docker.script);
  await executeTestsInDocker(config.executor.docker);

  // report the results

  await importCucumberResults(config.reporting.xray).report();
}


go();

//
// cli-test-pipeline -u <user> -p <password> -f ../marketingMVP.json
//
