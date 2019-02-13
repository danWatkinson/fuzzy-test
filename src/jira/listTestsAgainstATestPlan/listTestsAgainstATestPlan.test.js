const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');

const expect = require('../../../test/test-hooks').expect;

describe('listTestsAgainstATestPlan(options).list(testPlanKey)', () => {

  let axiosStub, listTestsAgainstATestPlan;

  beforeEach( () => {
    axiosStub = {
      get: sinon.stub()
    }

    listTestsAgainstATestPlan = proxyquire('./listTestsAgainstATestPlan', {
       'axios': axiosStub
     });

  })

  it('makes a get request to xray', () => {
    axiosStub.get.returns(Promise.resolve({data:[]}));

    listTestsAgainstATestPlan({hostname: "https://127.0.0.1"}).list('myTestPlan', {data:[]});

    expect(axiosStub.get).to.have.been.calledWith(
      'https://127.0.0.1/rest/raven/1.0/api/testplan/myTestPlan/test',
      sinon.match.any
    );
  })

  it('uses the username + password provided in the options', () => {
    axiosStub.get.returns(Promise.resolve({data:[]}));

    listTestsAgainstATestPlan({username: 'user', password:'password'}).list('myTestPlan', {data:[]});

    expect(axiosStub.get).to.have.been.calledWith(
      sinon.match.any,
      {auth: {username: 'user', password: 'password'}}
    );
  })

  it('resolves with a list of keys that point to our tests', async() => {
    axiosStub.get.returns(Promise.resolve({data:  [
      { id: 347519, key: 'XTP-16143', latestStatus: 'TODO' },
      { id: 347518, key: 'XTP-16142', latestStatus: 'TODO' }
    ]}));

    const results = await listTestsAgainstATestPlan({username: 'user', password:'password'}).list('myTestPlan', {data:[]});

    expect(results).to.deep.equal([ 'XTP-16143', 'XTP-16142' ]);
  })

})
