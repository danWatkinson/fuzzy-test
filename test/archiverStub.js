const sinon = require('sinon');

mockArchive = {
  pipe: sinon.stub(),
  on: sinon.stub(),
  glob: sinon.stub(),
  finalize: sinon.stub()
}

const archiver = sinon.stub();
archiver.returns(mockArchive)

const reset = () => {
  mockArchive.pipe.reset();
  mockArchive.on.reset();
  mockArchive.glob.reset();
  mockArchive.finalize.reset();
}

archiver.mockArchive = mockArchive;
archiver.reset = reset;

module.exports = archiver;
