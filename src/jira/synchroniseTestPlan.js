#!/usr/bin/env node
const options = require('commander');
const synchronise = require('./synchronise');

options
  .version('0.1.0')
  .option('-h, --hostname <string>', 'jira host')
  .option('-u, --username <string>', 'jira username')
  .option('-p, --password <string>', 'jira password')
  .option('-n, --project Name <string>', 'project name')
  .option('-s, --summary <string>', 'test-plan summary')
  .option('-q, --squad <string>', 'tribe:squad')
  .option('-c, --components <string>', 'comma-separated list of components')
  .option('-l, --labels <string>', 'comma-separated list of labels')
  .parse(process.argv);

synchronise(options);

//
// synchroniseTestPlan -n XTP -s "automated_test_plan_1" -q "Shop:Squad 1" -c Web -u michael.foley.ntt -p Magentys321! -h https://jira-dev.intdigital.ee.co.uk -l "Marketing_Tribe,Functional"
//
