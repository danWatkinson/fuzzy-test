
const expect = require('../../../test/test-hooks').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockStepdefinitions = sinon.stub();
const mockJira = sinon.stub();
const mockSynchronise = sinon.stub();
const mockPrepareTestExecution = sinon.stub();
const mockExportFeatures = sinon.stub();

const xray = proxyquire('./index', {
  './stepdefinitions': mockStepdefinitions,
  './jira': mockJira
});

describe( 'tests/xray', () => {

  describe( 'xray(xrayConfig).execute()', () => {

    beforeEach( () => {
      mockStepdefinitions.reset();
      mockJira.reset();
      mockSynchronise.reset();
      mockPrepareTestExecution.reset();
      mockExportFeatures.reset();

      mockJira.returns({
        synchronise: mockSynchronise,
        prepareTestExecution: mockPrepareTestExecution,
        exportFeatures: mockExportFeatures
      });
    });

    it ( 'calls stepDefinitions( ${xrayConfig.stepDefinitions} )', async () => {
      await xray({
        stepdefinitions: {some:'configuration'}
      }).execute();

      expect(mockStepdefinitions).to.have.been.calledWith({some:'configuration'})
    });

    it ( 'instantiates a jira connection using ${xrayConfig.jira}', async () => {
      await xray({
        jira: {some:'jiraConfiguration'}
      }).execute();

      expect(mockJira).to.have.been.calledWith({some:'jiraConfiguration'})
    });

    it ( 'gets a testPlanKey from jira connection by calling synchronise( ${xrayConfig.testplan} )', async () => {
      await xray({
        testplan: {some:'test plan information'}
      }).execute();

      expect(mockSynchronise).to.have.been.calledWith({some:'test plan information'})
    });


    it ( 'gets a testExecutionKey from jira connection by calling prepareTestExecution( ${xrayConfig.testplan} )', async () => {
      await xray({
        testplan: {some:'test plan information'}
      }).execute();

      expect(mockPrepareTestExecution).to.have.been.calledWith({some:'test plan information'})
    });

    it ( 'triggers an export from jira connection by calling exportFeatures( ${testPlanKey}, ${testExecutionKey}, ${xrayConfig.target} )', async () => {
      mockSynchronise.returns(Promise.resolve('aTestPlanKey'));
      mockPrepareTestExecution.returns(Promise.resolve('aTestExecutionKey'));

      await xray({
        target: {some:'target information'}
      }).execute();

      expect(mockExportFeatures).to.have.been.calledWith('aTestPlanKey', 'aTestExecutionKey', {some:'target information'})
    });

  })
})
