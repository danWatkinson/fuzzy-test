#!/usr/bin/env node
const options = require('commander');
const path = require('path');
const fse = require('fs-extra');

const clone = require('./git/clone');
const api = require('./jira/api/apiBuilder');
const exportTestPlan = require('./jira/exportTestPlan/exportTestPlan');
const synchronise = require('./jira/synchronise.js')

options
  .version('0.1.0')
  .option('-h, --hostname <string>', 'jira host')
  .option('-u, --username <string>', 'jira username')
  .option('-p, --password <string>', 'jira password')

  .option('-s, --summary <string>', 'test-plan "summary"')
  .option('-o, --output <string>', 'target file')

  .option('-n, --project Name <string>', 'project name')
  .option('-q, --squad <string>', 'tribe:squad')
  .option('-c, --components <string>', 'comma-separated list of components')
  .option('-l, --labels <string>', 'comma-separated list of labels')

  .option('-r, --repository <string>', 'url to repository eg. https://bitbucket.intdigital.ee.co.uk/scm/web/aem-automation.git')
  .option('-t, --targetPath <string>', 'where to clone to')
  .option('-b, --branch <string>', 'branch to clone')
  .parse(process.argv);


async function go() {
  await clone(options).performClone();

  await synchronise(options);

  const dirName = path.dirname(options.output);

  fse.ensureDirSync(dirName);

  const key = await api(options).findTestPlanBySummary();

  await exportTestPlan(options).execute(key);

}

go();

//
// cli-test-pipeline -u <user -p <pass> -h https://jira-dev.intdigital.ee.co.uk -n XTP -s "do i still get a testplan after refactoring again" -q "Shop:Squad 1" -c Web -l "Marketing_Tribe,Functional" -r https://bitbucket.intdigital.ee.co.uk/scm/web/aem-automation.git -t ../aem-automation -b features/danTest -o ../aem-automation/src/test/resources/features/exported.feature
//
