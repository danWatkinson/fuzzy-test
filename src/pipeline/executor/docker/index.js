const prepareDockerImage = require('./prepareDockerImage');
const createRunnerScript = require('./createRunnerScript');
const executeTestsInDocker = require('./executeTestsInDocker');

module.exports = (config) => {
  const {buildfile, imageName, containerName} = config;
  const {script} = config;

  const execute = async() => {
    await prepareDockerImage(buildfile, imageName, containerName);
    await createRunnerScript(script);
    await executeTestsInDocker(imageName, containerName, script);
  }

  return Object.freeze({
    execute
  });
}
