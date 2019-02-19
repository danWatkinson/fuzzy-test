const dockerCLI = require('docker-cli-js');
const Docker = dockerCLI.Docker;
const resolve = require('path').resolve

module.exports = async(options) => {
  console.log('executing against docker image');

  const {targetPath} = options;
  const docker = new Docker();

  // clean image
  try {
    const execute = await docker.command(`run --name mavenTest -v ${resolve(targetPath)}:/source:rw ee/maven ./runMaven.sh`);
    console.log(execute);
  } catch (error) {
    console.log(error);
  }

}
