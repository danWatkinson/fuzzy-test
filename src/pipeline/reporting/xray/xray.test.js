const expect = require('../../../../test/test-hooks').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockJira = sinon.stub();
const mockSendResults = sinon.stub();

const xray = proxyquire('./index', {
  './jira': mockJira
});

describe('reporting/xray(config).execute()', () => {

  beforeEach( () => {
    mockJira.reset();
    mockSendResults.reset();

    mockJira.returns({
      sendResults: mockSendResults
    });

  });

  it('creates a connection to jira using jira(config.jira)', async () => {
    await xray({
      jira: {jira:'config'}
    }).execute();

    expect( mockJira ).to.have.been.calledWith({jira:'config'});
  });

  it('calls sendResults(config.results) on the jira connection', async () => {
    await xray({
      results: {whereToFind:'results'}
    }).execute();

    expect( mockSendResults ).to.have.been.calledWith({whereToFind:'results'});
  });

  it('returns the result of sendResults', () => {
    const aPromise = new Promise(()=>{});
    mockSendResults.returns(aPromise);

    expect( xray({}).execute() ).to.equal( aPromise );

  })

})
