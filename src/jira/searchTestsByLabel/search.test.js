const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');

const hooks = require('../../../test/test-hooks');
const expect = hooks.expect;
const loadFile = hooks.loadFile;

const path = require('path');
const testResources = path.resolve(__dirname, '../../resources/JiraAPIData');

const hostname = 'https://jira-dev.intdigital.ee.co.uk';
const jiraAPI = '/rest/api/2';
const jiraSearch = jiraAPI + '/search';

describe('search(options).execute()', () => {

  let search, axiosStub;

  const emptyResults = {data:{issues:[]}};

  beforeEach( () => {
    axiosStub = {
      get: sinon.stub()
    }

    search = proxyquire('./search', {
       'axios': axiosStub
     });
  })

  it('passes options.username and options.password to axios as the auth option', async() => {
    const expectedAuthObject = { auth: { password: "myPassword", username: "myUserName" } };
    axiosStub.get.returns(Promise.resolve(emptyResults));

    const searchResult = await search({username: 'myUserName', password: 'myPassword'}).execute();

    expect(axiosStub.get).to.have.been.calledWith(sinon.match.any, expectedAuthObject);
  });

  it('returns the keys of each test it finds', async() => {
    const testData = JSON.parse(loadFile('JiraAPIData/searchReturns2Tests.json'))

    axiosStub.get.returns(Promise.resolve({data:testData}));

    const searchResult = await search({hostname: hostname}).execute();

    expect(searchResult).to.deep.equal(["XTP-16143", "XTP-16142"]);
  });

});
