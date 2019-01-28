const fileProvider = require('./fileProvider');
const reportParser = require('./reportParser');

module.exports = (options) => {

  const provider = fileProvider(options);
  const parser = reportParser(options);
  let report = [];

  const load = () => {
    return new Promise( (resolve, reject) => {

      const files = provider.list();
      const parsedFiles = [];

      files.forEach( (file) => {
        const parseResult = parser.parse(file);
        report = report.concat(parseResult);

        parsedFiles.push(file);
        if (parsedFiles.length == files.length) {
          resolve();
        }
      });

    })
  };

  const scenarios = () => {
    return report;
  };

  return Object.freeze({
    load,
    scenarios
  });
}
