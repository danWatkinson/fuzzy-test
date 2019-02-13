module.exports = (options) => {

  const {hostname} = options;

  const build = (testPlanKey) => {
    return hostname + '/rest/raven/1.0/api/testplan/' + testPlanKey + '/test';
  }

  return Object.freeze({
    build
  })
}
