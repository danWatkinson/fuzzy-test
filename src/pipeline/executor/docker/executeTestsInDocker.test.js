const expect = require('../../../../test/test-hooks').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockDockerCLI = require('../../../../test/dockerStub');

const executeTestsInDocker = proxyquire('./executeTestsInDocker', {
  'docker-cli-js': mockDockerCLI,
});

describe('executeTestsInDocker(imageName, containerName, script)', () => {
  it('executes our script inside our docker image', () => {
    executeTestsInDocker('someImageName', 'someContainerName', {
      "imageRoot": "/image/root",
      "relativeScriptPath": "./execute.sh",
    })

    expect(mockDockerCLI.command).to.have.been.calledWith('run --name someContainerName -v /image/root:/source:rw someImageName ./execute.sh')
  });

});
