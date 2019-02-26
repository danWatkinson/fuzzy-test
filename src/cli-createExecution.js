#!/usr/bin/env node
const options = require('commander');

const importCucumberResults = require('./jira/importResults/importCucumberResults');

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
  await importCucumberResults(config.reporting.xray).report();
}


go();
