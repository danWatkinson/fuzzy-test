const expect = require('../../../../../test/test-hooks').expect;
const fs = require('fs');
const mock = require('mock-fs');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockJiraAPI = sinon.stub();
const mockImportTestExecutionResults = sinon.stub();

const mockZip = sinon.stub();

const xray = proxyquire('./index', {
  '../../../../jiraAPI': mockJiraAPI,
  './zip': mockZip
});

describe( 'reporting/xray/jira', () =>{
  describe( 'jira(jiraConfig).sendResults(resultsConfig)', () => {

    beforeEach( () => {
      mockJiraAPI.reset();
      mockImportTestExecutionResults.reset();
      mockJiraAPI.returns({
        importTestExecutionResults: mockImportTestExecutionResults
      });

      mockZip.reset();
      mockZip.returns(Promise.resolve());
    });

    afterEach( () => {
      mock.restore();
    })

    it( 'configures a jira API using the provided jiraConfig', () => {
      xray({some:'config'});

      expect(mockJiraAPI).to.have.been.calledWith({some:'config'});
    });

    it( 'zips the content of ${resultsConfig.reportsDir}/*.json into ${resultsConfig.temporaryZip}', async () => {
      await xray({some:'config'}).sendResults({
        reportsDir: 'source/files',
        temporaryZip: 'target/out.zip'
      });

      expect(mockZip).to.have.been.calledWith('source/files/*.json', 'target/out.zip');
    });


    it('calls jiraAPI.importTestExecutionResults(${resultsConfig.tempraryZip})', async () => {
      await xray({some:'config'}).sendResults({
        reportsDir: 'source/files',
        temporaryZip: 'target/out.zip'
      });
      expect(mockImportTestExecutionResults).to.have.been.calledWith('target/out.zip');
    })
  });
});
