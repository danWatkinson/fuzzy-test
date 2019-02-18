#!/usr/bin/env node
const options = require('commander');

const clone = require('./git/clone');

options
  .version('0.1.0')
  .option('-r, --repository <string>', 'url to repository eg. https://bitbucket.intdigital.ee.co.uk/scm/web/aem-automation.git')
  .option('-t, --targetPath <string>', 'where to clone to')
  .option('-b, --branch <string>', 'branch to clone')
  .parse(process.argv);


async function go() {
  await clone(options).performClone();
}

go();


//
//  cloneStepDefs -r https://bitbucket.intdigital.ee.co.uk/scm/web/aem-automation.git -t ../aem-automation -b features/danTest
//
