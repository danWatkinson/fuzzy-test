#!/usr/bin/env node
const options = require('commander');

const findTestPlanBySummary = require('./jira/api/findTestPlanBySummary/search');
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
  const key = await findTestPlanBySummary(options).execute();

  await exportTestPlan(options).execute(key);
}

go();
