const combinedReport = require('./combinedReport');
const reportAnalyser = require('./reportAnalyser');

module.exports = (config) => {

  const execute = async() => {

    const report = combinedReport(config);
    report.load();

    const analyser = reportAnalyser(config);

    const result = analyser.analyse(report.scenarios());

    return result;
  }

  return Object.freeze({
    execute
  })
}
