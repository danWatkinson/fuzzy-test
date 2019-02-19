#!/usr/bin/env node
const options = require('commander');
const path = require('path');
const fse = require('fs-extra');

const api = require('./jira/api/apiBuilder');
const exportTestPlan = require('./jira/exportTestPlan/exportTestPlan');

options
  .version('0.1.0')
  .option('-h, --hostname <string>', 'jira host')
  .option('-u, --username <string>', 'jira username')
  .option('-p, --password <string>', 'jira password')
  .option('-s, --summary <string>', 'test-plan summary')
  .option('-o, --output <string>', 'target file')
  .parse(process.argv);


async function go() {
  const dirName = path.dirname(options.output);

  fse.ensureDirSync(dirName);

  const key = await api(options).findTestPlanBySummary();

  await exportTestPlan(options).execute(key);
}

go();
