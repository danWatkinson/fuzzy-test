const expect = require('../../../test/test-hooks').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockPrepareDockerImage = sinon.stub();
const mockCreateRunnerScript = sinon.stub();
const mockExecuteTestsInDocker = sinon.stub();

const docker = proxyquire('./index', {
  './prepareDockerImage': mockPrepareDockerImage,
  './createRunnerScript': mockCreateRunnerScript,
  './executeTestsInDocker': mockExecuteTestsInDocker
});

describe('docker(config).execute()', () => {

  beforeEach( () => {
    mockPrepareDockerImage.returns(Promise.resolve());
    mockCreateRunnerScript.returns(Promise.resolve());
    mockExecuteTestsInDocker.returns(Promise.resolve());
  });

  it('calls prepareDockerImage(config.buildfile, config.imageName, config.containerName)', async () => {
    await docker({
      buildfile: '../docker',
      imageName: 'ee/mvnTestExecutor',
      containerName: 'mvnTestExecutor'
    }).execute();

    expect( mockPrepareDockerImage ).to.have.been.calledWith('../docker', 'ee/mvnTestExecutor', 'mvnTestExecutor');
  });


  it('calls createRunnerScript(config.script)', async () => {
    await docker({
      script: {
        some:'script'
      }
    }).execute();

    expect( mockCreateRunnerScript ).to.have.been.calledWith({some:'script'});
  });

  it('calls executeTestsInDocker(config.imageName, config.containerName, config.script)', async () => {
    await docker({
      imageName: 'ee/mvnTestExecutor',
      containerName: 'mvnTestExecutor',
      script: {
        some:'script'
      }
    }).execute();

    expect( mockExecuteTestsInDocker ).to.have.been.calledWith(
        'ee/mvnTestExecutor',
        'mvnTestExecutor',
        { some:'script' }
      )
  });
})
