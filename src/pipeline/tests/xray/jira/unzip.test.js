const sinon = require('sinon');
const proxyquire = require('proxyquire');

const expect = require('../../../../../test/test-hooks').expect;

const mockExtract = sinon.stub();

const unzip = proxyquire('./unzip', {
  'extract-zip': mockExtract
});

describe('unzip(zip, targetPath)', () => {

  beforeEach( () => {
    mockExtract.reset();
    mockExtract.callsArgAsync(2);
  });

  it('uses extract-zip to extract ${zip} to ${targetPath}', async () => {
    await unzip('./my.zip', '/some/target/path');

    expect(mockExtract).to.have.been.calledWith('./my.zip', {dir: '/some/target/path'}, sinon.match.any);
  });

  it('uses extract-zip to extract ${zip} to ${targetPath}', (done) => {
    mockExtract.callsArgWithAsync(2, 'Oh noes, a thing went wrong!');

    unzip('./my.zip', '/some/target/path').catch((error) => {
      expect(error).to.equal('Oh noes, a thing went wrong!');
      done();
    });

  });

});
