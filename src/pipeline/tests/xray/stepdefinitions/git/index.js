const clone = require('./clone');
const cleanTargetPath = require('./cleanTargetPath');

module.exports = (config) => {

  const execute = async() => {
    const {repository, branch, targetPath} = config;

    await cleanTargetPath(targetPath);
    await clone(repository, branch, targetPath);
  }

  return Object.freeze({
    execute
  })
}
