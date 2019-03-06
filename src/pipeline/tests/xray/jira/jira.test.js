const expect = require('../../../../../test/test-hooks').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const jiraAPIStub = require('../../../../../test/jiraAPIStub');

const mockJira = sinon.stub();
const mockJiraAPI = jiraAPIStub();

const mockFSExtra = {
  ensureDirSync: sinon.stub()
}

const mockUnzip = sinon.stub();
mockUnzip.returns(Promise.resolve());

const mockPrepend = sinon.stub();

const jira = proxyquire('./index', {
  '../../../../jiraAPI': mockJira,
  'fs-extra': mockFSExtra,
  './unzip': mockUnzip,
  './prependTestExecutionIdToAllFeatures': mockPrepend
});

describe('/tests/xray/jira', () => {

  beforeEach( () => {
    mockJira.reset();
    mockJiraAPI.reset();

    mockJira.returns( mockJiraAPI );
  });

  describe('jira(config)', () => {

    it('instantiates jiraAPI(${config})', () => {
      jira({some:'config'});

      expect(mockJira).to.have.been.calledWith({some:'config'});
    });

    describe('synchronise(testPlan)', () => {

      beforeEach( () => {
        mockJiraAPI.findTestPlanBySummary.returns(Promise.resolve());
        mockJiraAPI.createTestPlan.returns(Promise.resolve('ABC-123'));
        mockJiraAPI.findTestsByLabels.returns(Promise.resolve([]));
        mockJiraAPI.listTestsAgainstATestPlan.returns(Promise.resolve([]));
        mockJiraAPI.synchroniseTestPlan.returns(Promise.resolve());
      });

      it('looks for an existing testplan by ${config.summary}', async () => {
        const aTestPlan = {
          summary: 'some hopefully unique name for our test plan..'
        }

        await jira({some:'config'}).synchronise(aTestPlan);

        expect(mockJiraAPI.findTestPlanBySummary).to.have.been.calledWith('some hopefully unique name for our test plan..');
      });

      it('gets a list of all tests with the provided labels', async () => {
        const aTestPlan = {
          labels: ['label1', 'label2']
        }

        await jira({some:'config'}).synchronise(aTestPlan);

        expect(mockJiraAPI.findTestsByLabels).to.have.been.calledWith(['label1', 'label2']);
      });

      it('gets a list of all tests currently associated with the testplan', async () => {
        const aTestPlan = {};

        mockJiraAPI.findTestPlanBySummary.reset();
        mockJiraAPI.findTestPlanBySummary.returns(Promise.resolve('AAA-BBB'));

        await jira({some:'config'}).synchronise(aTestPlan);

        expect(mockJiraAPI.listTestsAgainstATestPlan).to.have.been.calledWith('AAA-BBB');
      });

      it('diffs the list of tests that have the right labels, and the list of tests that are already associated with our test plan, and sends the delta to api.synchroniseTestPlan', async () => {
        const aTestPlan = {};

        mockJiraAPI.findTestPlanBySummary.reset();
        mockJiraAPI.findTestPlanBySummary.returns(Promise.resolve('AAA-BBB'));

        mockJiraAPI.findTestsByLabels.returns(Promise.resolve(['A','B','C']));
        mockJiraAPI.listTestsAgainstATestPlan.returns(Promise.resolve(['A','C','E']));

        await jira({some:'config'}).synchronise(aTestPlan);

        expect(mockJiraAPI.synchroniseTestPlan).to.have.been.calledWith('AAA-BBB', {
          added: ['B'],
          common: ['A','C'],
          removed: ['E']
        });

        it('if we cannot find a testplan based on ${testplan.summary}: creates a test plan based on the provided ${testplan} fields', async () => {
          const aTestPlan = {
            summary: 'aSummary',
            project: 'aProject',
            tribe: 'aTribe',
            squad: 'aSquad',
            components: ['aComponent'],
            labels: ['aLabel']
          }

          await jira({some:'config'}).synchronise(aTestPlan);

          expect(mockJiraAPI.createTestPlan).to.have.been.calledWith(aTestPlan);
        });


      });

    });
    //TODO - smelly; tests demonstrate that we have built in some mandatory internal state here,
    //               so suddenly we have to call the methods in the right order or the world will break...
    describe('prepareTestExecution(testPlan)', () => {

      beforeEach( () => {
        mockJiraAPI.findTestPlanBySummary.returns(Promise.resolve('ABC-123'));
        mockJiraAPI.findTestsByLabels.returns(Promise.resolve(['A']));
        mockJiraAPI.listTestsAgainstATestPlan.returns(Promise.resolve(['A']));
        mockJiraAPI.synchroniseTestPlan.returns(Promise.resolve());

        mockJiraAPI.createTestExecution.returns(Promise.resolve());
        mockJiraAPI.associateTestExecutionWithPlan.returns(Promise.resolve());
        mockJiraAPI.addTestsToTestExecution.returns(Promise.resolve());
      });

      it('creates a testExecution', async () => {
        const aTestPlan = {
          summary: 'aSummary',
          project: 'aProject',
          tribe: 'aTribe',
          squad: 'aSquad',
          components: ['aComponent'],
          labels: ['aLabel']
        }

        const myJira = jira({some:'config'});
        await myJira.synchronise(aTestPlan);
        await myJira.prepareTestExecution(aTestPlan);

        expect(mockJiraAPI.createTestExecution).to.have.been.calledWith(aTestPlan);
      });

      it('associates the testExecution with the testPlan we identified when we synchronised...', async () => {
        const aTestPlan = {
          summary: 'aSummary',
          project: 'aProject',
          tribe: 'aTribe',
          squad: 'aSquad',
          components: ['aComponent'],
          labels: ['aLabel']
        }

        mockJiraAPI.findTestPlanBySummary.returns(Promise.resolve('MY-TEST-PLAN'));
        mockJiraAPI.createTestExecution.returns(Promise.resolve('MY-TEST-EXECUTION'));

        const myJira = jira({some:'config'});
        await myJira.synchronise(aTestPlan);
        await myJira.prepareTestExecution(aTestPlan);

        expect(mockJiraAPI.associateTestExecutionWithPlan).to.have.been.calledWith('MY-TEST-EXECUTION', 'MY-TEST-PLAN');
      });

      //TODO check this actually needs to be done... it could be that importing the results is enough to create all these tests..
      //     figured it's better to have an idea up-front of how many tests we're expecting to run, for anyone poking around in jira..
      it('adds all the tests that are part of the testplan to the test execution', async () => {
        const aTestPlan = {
          summary: 'aSummary',
          project: 'aProject',
          tribe: 'aTribe',
          squad: 'aSquad',
          components: ['aComponent'],
          labels: ['aLabel']
        }

        mockJiraAPI.createTestExecution.returns(Promise.resolve('MY-TEST-EXECUTION'));
        mockJiraAPI.findTestsByLabels.returns(Promise.resolve(['TEST1', 'TEST2']));

        const myJira = jira({some:'config'});
        await myJira.synchronise(aTestPlan);
        await myJira.prepareTestExecution(aTestPlan);

        expect(mockJiraAPI.addTestsToTestExecution).to.have.been.calledWith('MY-TEST-EXECUTION', ['TEST1', 'TEST2']);
      });

    });

    //TODO - smelly; tests demonstrate that we have built in some mandatory internal state here,
    //               so suddenly we have to call the methods in the right order or the world will break...
    //     - NB we can also see that on the basis of the ever growing number of responses we have to pre-assume
    //     (all just means it would be nice to spend time re-thinking how this is put together at some point.
    //      it works, though.. so not prioritising..)
    describe('exportFeatures(testPlanKey, testExecutionKey, target)', () => {

      beforeEach( () => {
        mockJiraAPI.findTestPlanBySummary.returns(Promise.resolve('ABC-123'));
        mockJiraAPI.findTestsByLabels.returns(Promise.resolve(['A']));
        mockJiraAPI.listTestsAgainstATestPlan.returns(Promise.resolve(['A']));
        mockJiraAPI.synchroniseTestPlan.returns(Promise.resolve());
        mockJiraAPI.createTestExecution.returns(Promise.resolve('EXECUTION-123'));
        mockJiraAPI.associateTestExecutionWithPlan.returns(Promise.resolve());
        mockJiraAPI.addTestsToTestExecution.returns(Promise.resolve());

//fse.ensureDirSync(target.unzipTarget);
// await api.triggerExport(testPlanKey, target.temporaryZip);
// await unzip(target.temporaryZip, target.unzipTarget);
// await prependTestExecutionIdToAllFeatures(target.unzipTarget, testExecutionKey);
        mockJiraAPI.triggerExport.returns(Promise.resolve());

      });

      it('ensures the ${config.target.unzipTarget} directory exists', async () => {
        const aTestPlan = {
          summary: 'aSummary',
          project: 'aProject',
          tribe: 'aTribe',
          squad: 'aSquad',
          components: ['aComponent'],
          labels: ['aLabel']
        }

        const target = {
          unzipTarget: 'target/directory',
          temporaryZip: '/tmp/zip.zip'
        }

        const myJira = jira({some:'config'});
        await myJira.synchronise(aTestPlan);
        await myJira.prepareTestExecution(aTestPlan);
        await myJira.exportFeatures('ABC-123', 'EXECUTION-123', target)

        expect(mockFSExtra.ensureDirSync).to.have.been.calledWith('target/directory');
      });


      it('calls api.triggerExport(testPlanKey, ${target.temporaryZip})', async () => {
        const aTestPlan = {
          summary: 'aSummary',
          project: 'aProject',
          tribe: 'aTribe',
          squad: 'aSquad',
          components: ['aComponent'],
          labels: ['aLabel']
        }

        const target = {
          unzipTarget: 'target/directory',
          temporaryZip: '/tmp/zip.zip'
        }

        const myJira = jira({some:'config'});
        await myJira.synchronise(aTestPlan);
        await myJira.prepareTestExecution(aTestPlan);
        await myJira.exportFeatures('ABC-123', 'EXECUTION-123', target)

        expect(mockJiraAPI.triggerExport).to.have.been.calledWith('ABC-123', '/tmp/zip.zip');
      });

      it('unzips ${target.temporaryZip} into ${target.unzipTarget}', async () => {
        const aTestPlan = {
          summary: 'aSummary',
          project: 'aProject',
          tribe: 'aTribe',
          squad: 'aSquad',
          components: ['aComponent'],
          labels: ['aLabel']
        }

        const target = {
          unzipTarget: 'target/directory',
          temporaryZip: '/tmp/zip.zip'
        }

        const myJira = jira({some:'config'});
        await myJira.synchronise(aTestPlan);
        await myJira.prepareTestExecution(aTestPlan);
        await myJira.exportFeatures('ABC-123', 'EXECUTION-123', target)

        expect(mockUnzip).to.have.been.calledWith('/tmp/zip.zip', 'target/directory');
      });

      it('prepends all feature files under ${target.unzipTarget} with our testExecution key', async () => {
        const aTestPlan = {
          summary: 'aSummary',
          project: 'aProject',
          tribe: 'aTribe',
          squad: 'aSquad',
          components: ['aComponent'],
          labels: ['aLabel']
        }

        const target = {
          unzipTarget: 'target/directory',
          temporaryZip: '/tmp/zip.zip'
        }

        const myJira = jira({some:'config'});
        await myJira.synchronise(aTestPlan);
        await myJira.prepareTestExecution(aTestPlan);
        await myJira.exportFeatures('ABC-123', 'EXECUTION-123', target)

        expect(mockPrepend).to.have.been.calledWith('target/directory', 'EXECUTION-123');
      });

    });

  });

});
