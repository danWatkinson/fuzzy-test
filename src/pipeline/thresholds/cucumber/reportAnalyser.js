module.exports = (options) => {
  const { threshold, verbose } = options;

  const analyse = (report) => {
    let passCount = 0;
    let totalCount = 0;

    report.forEach( (feature) => {

      feature.forEach( (scenario) => {
          totalCount ++;
          if (scenario.result == 'passed') {
            passCount ++;
          }

          if (verbose) {
            console.log(scenario.name + ' | ' + scenario.result + ' -> ' + passCount + ' / ' + totalCount + ' | ' + passCount/totalCount);
          }
        })
      });

    return passCount / totalCount >= threshold ? 'passed' : 'failed';
  }

  return Object.freeze({
    analyse
  })

}
