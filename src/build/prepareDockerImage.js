const dockerCLI = require('docker-cli-js');
const Docker = dockerCLI.Docker;

module.exports = async(config) => {
  console.log('preparing docker image');

  const {targetPath, imageName, containerName} = config;
  const docker = new Docker();

  // clean image
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

  console.log('rebuilding image')
  const rebuild = await docker.command(`build -t ${imageName} ${targetPath}/docker`);
  console.log(rebuild.response);
}
