const expect = require('../../../../../test/test-hooks').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockGitClone = sinon.stub();
mockGitClone.callsArgAsync(3);

const clone = proxyquire('./clone', {
  'git-clone': mockGitClone
});


describe('tests/xray/stepdefinitions/git/clone', () => {

  beforeEach( () => {
    mockGitClone.reset();
    mockGitClone.callsArgAsync(3);
  });

  it('passes the provided repository to git-clone', async () => {
    await clone('git://myRepo.git', 'some/branch', '../some/directory');

    expect(mockGitClone).to.have.been.calledWith('git://myRepo.git', sinon.match.any, sinon.match.any);
  });

  it('passes the provided targetPath to git-clone', async () => {
    await clone('git://myRepo.git', 'some/branch', '../some/directory');

    expect(mockGitClone).to.have.been.calledWith(sinon.match.any, '../some/directory', sinon.match.any);
  });

  it('if branch is provided, passes that as an option to git-cline', async () => {
    await clone('git://myRepo.git', 'some/branch', '../some/directory');

    expect(mockGitClone).to.have.been.calledWith(sinon.match.any, sinon.match.any, {checkout: 'some/branch'});
  });

  it('if no branch is provided, doesnt request a branch from git-clone', async () => {
    await clone('git://myRepo.git', null, '../some/directory');

    expect(mockGitClone).to.have.been.calledWith(sinon.match.any, sinon.match.any, {});
  });

  it('rejects with any errors given by git-clone', (done) => {
    mockGitClone.reset();
    mockGitClone.callsArgWithAsync(3, 'ooh something went bad');

    clone('git://myRepo.git', null, '../some/directory').catch( (err) => {
      expect(err).to.equal('ooh something went bad');
      done();
    });

  });
});
