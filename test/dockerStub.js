const sinon = require('sinon');

const DockerStub = sinon.stub();
const commandStub = sinon.stub();

const reset = () => {
  DockerStub.reset();
  commandStub.reset();

  DockerStub.returns({
    command: commandStub
  })
}

reset();

module.exports = {
  Docker: DockerStub,
  command: commandStub,

  reset
}
