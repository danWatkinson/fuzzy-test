module.exports = (options) => {
  const { threshold } = options;

  const analyse = (report) => {
    let passCount = 0;
    let totalCount = 0;

    report.forEach( (feature) => {

      feature.forEach( (scenario) => {
          totalCount ++;
          if (scenario.result == 'passed') {
            passCount ++;
          }
        })
      });

    return passCount / totalCount >= threshold ? 'passed' : 'failed';
  }

  return Object.freeze({
    analyse
  })

}
