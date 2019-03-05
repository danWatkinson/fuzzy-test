#!/usr/bin/env node
const options = require('commander');

const tests = require('../tests');
const executor = require('../executor');
const reporting = require('../reporting');
const thresholds = require('../thresholds');

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

async function executePipeline() {

  try {
    await tests(config.tests);
  } catch (error) {
    console.error('Failed to acquire tests.');
    throw(error);
  }

  try {
    await executor(config.executor);
  } catch (error) {
    console.error('Failed to execute tests.');
    throw(error);
  }

  try {
    await reporting(config.reporting);
  } catch (error) {
    console.error('Failed to report results of tests.');
    throw(error);
  }

  try {
    return await thresholds(config.thresholds);
  } catch (error) {
    console.error('Failed to apply thresholds to tests.');
    throw(error);
  }
}

executePipeline().then( (result) => {
  if (result == 'passed') {
    console.log('tests passed thresholds');
    process.exit(0);
  } else {
    console.error('tests failed to pass thresholds');
    process.exit(1);
  }
}).catch( (error) => {
  console.error(error);
  process.exit(1);
});
