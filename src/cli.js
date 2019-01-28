#!/usr/bin/env node

const program = require('commander');

const combinedReport = require('./parse/combinedReport');
const reportAnalyser = require('./threshold/reportAnalyser');

program
  .version('0.1.0')
  .option('-t, --threshold <float>', 'set threshold')
  .option('-r, --reportDirectory <path>', 'set source directory')
  .parse(process.argv);

const report = combinedReport(program);
report.load();

const analyser = reportAnalyser(program);

const result = analyser.analyse(report.scenarios());

if (result == 'passed') {
  console.log('passed');
  process.exit();
} else {
  console.log('failed');
  process.exit(1);
}
