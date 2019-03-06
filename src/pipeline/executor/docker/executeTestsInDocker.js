const dockerCLI = require('docker-cli-js');
const Docker = dockerCLI.Docker;
const resolve = require('path').resolve

module.exports = async(imageName, containerName, script) => {
  console.log('executing against docker image');
  const {imageRoot, relativeScriptPath} = script;
  const docker = new Docker();

  try {
    const execute = await docker.command(`run --name ${containerName} -v ${resolve(imageRoot)}:/source:rw ${imageName} ${relativeScriptPath}`);
    console.log(execute);
  } catch (error) {
    console.log(error);
  }

}
