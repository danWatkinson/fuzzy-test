const dockerCLI = require('docker-cli-js');
const Docker = dockerCLI.Docker;

module.exports = async(options) => {
  console.log('preparing docker image');

  const {targetPath} = options;
  const docker = new Docker();

  // clean image
  try {
    console.log('clearing any historical containers')
    const cleanContainer = await docker.command('rm mavenTest');
  } catch (error) {
    console.log(error);
  }

  try {
    console.log('clearing image')
    const cleanImage = await docker.command('rmi ee/maven');
  } catch (error) {
    console.log(error);
  }

  console.log('rebuilding image')
  const rebuild = await docker.command(`build -t ee/maven ${targetPath}/docker`);
  console.log(rebuild.response);
}
