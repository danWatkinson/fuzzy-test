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

const configParser = require('./configuration/configParser');

options
  .version('0.1.0')
  .option('-u, --username <string>', 'jira username')
  .option('-p, --password <string>', 'jira password')
  .option('-f, --config <string>', 'location of config file')

  .option('-x, --perfectoToken <string>', 'perfecto security token')

  .parse(process.argv);

const config = configParser(options);

async function go() {
  await clone(config.config.tests.xray.stepdefs.git).performClone();

  await synchronise(config);

  const dirName = path.dirname(config.config.tests.xray.features.output); //TODO do this better

  fse.ensureDirSync(dirName);

  const key = await api(config).findTestPlanBySummary();

  await exportTestPlan(config).execute(key);

  await prepareDockerImage(config.config.executor.docker);

  await createRunnerScript(config.config.executor.docker.script);

  await executeTestsInDocker(config.config.executor.docker);
}


go();

//
// cli-test-pipeline -u <user> -p <password> -f ../marketingMVP.json
//
