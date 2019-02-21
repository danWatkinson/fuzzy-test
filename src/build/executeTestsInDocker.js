const dockerCLI = require('docker-cli-js');
const Docker = dockerCLI.Docker;
const resolve = require('path').resolve

module.exports = async(config) => {
  console.log('executing against docker image');

  const {targetPath, containerName, imageName} = config;
  const docker = new Docker();

  // clean image
  try {
    const execute = await docker.command(`run --name ${containerName} -v ${resolve(targetPath)}:/source:rw ${imageName} ./runMaven.sh`);
    console.log(execute);
  } catch (error) {
    console.log(error);
  }

}
