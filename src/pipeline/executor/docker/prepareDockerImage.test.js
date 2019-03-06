const expect = require('../../../../test/test-hooks').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockDockerCLI = require('../../../../test/dockerStub');

const prepareDockerImage = proxyquire('./prepareDockerImage', {
  'docker-cli-js': mockDockerCLI,
});

describe('prepareDockerImage(buildfile, imageName, containerName)', () => {
  it('removes any old copy of the container', () => {
    prepareDockerImage('./docker', 'someImageName', 'someContainerName')

    expect(mockDockerCLI.command).to.have.been.calledWith('rm someContainerName')
  });

  it('removes any old copy of the image', () => {
    prepareDockerImage('./docker', 'someImageName', 'someContainerName')

    expect(mockDockerCLI.command).to.have.been.calledWith('rmi someImageName')
  });

  it('re-builds the image from the provided dockerfile', () => {
    prepareDockerImage('./docker', 'someImageName', 'someContainerName')

    expect(mockDockerCLI.command).to.have.been.calledWith('build -t someImageName ./docker')
  });

});
