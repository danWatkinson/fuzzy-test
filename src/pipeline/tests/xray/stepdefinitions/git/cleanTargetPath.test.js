const expect = require('../../../../../../test/test-hooks').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const mockFSE = {
  emptyDir: sinon.stub()
}

const cleanTargetPath = proxyquire('./cleanTargetPath', {
  'fs-extra': mockFSE
})

describe('cleanTargetPath(targetPath)', () => {
  it('uses fs-extra.emptyDir to clean out the targetPath', async () => {
    mockFSE.emptyDir.callsArgAsync(1);

    await cleanTargetPath('somePath');

    expect(mockFSE.emptyDir).to.have.been.calledWith('somePath');
  });

  it('rejects with any thrown errors', (done) => {
    mockFSE.emptyDir.callsArgWithAsync(1, 'ooh something went bad');

    cleanTargetPath('somePath').catch( (error) => {
      expect(error).to.equal('ooh something went bad');
      done();
    });

  });
});
