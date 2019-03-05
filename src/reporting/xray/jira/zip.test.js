const expect = require('../../../../test/test-hooks').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockArchiver = require('../../../../test/archiverStub');
const mockFS = require('../../../../test/fsStub');

const zip = proxyquire('./zip', {
  'archiver': mockArchiver,
  'fs': mockFS
});

describe('zip', () => {

  beforeEach( () => {
    mockArchiver.reset();
  });

  it('creates a writeStream pointing to the provided ${temporaryZip}', () => {
    const dummyWriteStream = {on:()=>{}};
    mockFS.createWriteStream.returns(dummyWriteStream);

    zip('glob', 'targetFile');

    expect(mockFS.createWriteStream).to.have.been.calledWith('targetFile');
  });

  it('creates a zip archive', () => {
    const dummyWriteStream = {on:()=>{}};
    mockFS.createWriteStream.returns(dummyWriteStream);

    zip('glob', 'targetFile');

    expect(mockArchiver).to.have.been.calledWith('zip');
  });

  it('pipes the zip archive to the writeStream', () => {
    const dummyWriteStream = {on:()=>{}};
    mockFS.createWriteStream.returns(dummyWriteStream);

    zip('glob', 'targetFile');

    expect(mockArchiver.mockArchive.pipe).to.have.been.calledWith(dummyWriteStream);
  });

  it('reads the archive from the provided ${fileGlob}', () => {
    const dummyWriteStream = {on:()=>{}};
    mockFS.createWriteStream.returns(dummyWriteStream);

    zip('glob', 'targetFile');

    expect(mockArchiver.mockArchive.glob).to.have.been.calledWith('glob');
  });

  it('finalizes the archive', () => {
    const dummyWriteStream = {on:()=>{}};
    mockFS.createWriteStream.returns(dummyWriteStream);

    zip('glob', 'targetFile');

    expect(mockArchiver.mockArchive.finalize).to.have.been.calledWith();
  });

  xit('resolves when close is called on the writestream', () => {

  });

  xit('rejects if errors occur in the archive', () => {

  });

});
