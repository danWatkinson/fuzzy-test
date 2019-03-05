const expect = require('../../../../../test/test-hooks').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockClean = sinon.stub();
const mockClone = sinon.stub();

const git = proxyquire('./index', {
  './clone': mockClone,
  './cleanTargetPath': mockClean
});

describe('git', () => {

  describe('git(config).execute()', () => {

    it('cleans ${config.targetPath}', async () => {
      await git({targetPath: '/target/path'}).execute();

      expect(mockClean).to.have.been.calledWith('/target/path');
    });

    it('clones ${config.repository} / ${config.branch} into ${config.targetPath}', async () => {
      await git({
        repository: 'git://blah.git',
        branch: 'develop',
        targetPath: '/target/path'
      }).execute();

      expect(mockClone).to.have.been.calledWith('git://blah.git', 'develop', '/target/path');
    });
  });

});
