const dockerCLI = require('docker-cli-js');
const Docker = dockerCLI.Docker;

module.exports = async(buildfile, imageName, containerName) => {
  console.log('preparing docker image');

  const docker = new Docker();

  return new Promise( async(resolve, reject) => {
    try {
      console.log('clearing any historical containers')
      const cleanContainer = await docker.command(`rm ${containerName}`);
    } catch (error) {
      console.log(error);
    }

    try {
      console.log('clearing image')
      const cleanImage = await docker.command(`rmi ${imageName}`);
    } catch (error) {
      console.log(error);
    }

    try {
      console.log('rebuilding image')
      const rebuild = await docker.command(`build -t ${imageName} ${buildfile}`);
      console.log(rebuild.response);
    } catch (error) {
      reject(error);
    }

    resolve();
  })
}
