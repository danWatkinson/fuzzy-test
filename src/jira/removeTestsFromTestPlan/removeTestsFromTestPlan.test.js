const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');

const expect = require('../../../test/test-hooks').expect;

const axiosStub = {
  post: sinon.stub()
}

axiosStub.post.returns(Promise.resolve([]));

const removeTestsFromTestPlan = proxyquire('./removeTestsFromTestPlan', {
   'axios': axiosStub
 });


describe('removeTestsFromTestPlan(options).remove(listOfTests)', () => {

  it('makes a post request to xray', () => {
    removeTestsFromTestPlan({hostname: "https://127.0.0.1"}).remove('myTestPlan', []);

    expect(axiosStub.post).to.have.been.calledWith(
      'https://127.0.0.1/rest/raven/1.0/api/testplan/myTestPlan/test',
      sinon.match.any,
      sinon.match.any
    );
  })

  it('posts the list of tests to remove', () => {
    removeTestsFromTestPlan({}).remove('myTestPlan', ["ABC-123","DEF-456"]);

    expect(axiosStub.post).to.have.been.calledWith(
      sinon.match.any,
      {remove: ["ABC-123","DEF-456"]},
      sinon.match.any
    );
  })

  it('uses the username + password provided in the options', () => {
    removeTestsFromTestPlan({username: 'user', password:'password'}).remove('myTestPlan', []);

    expect(axiosStub.post).to.have.been.calledWith(
      sinon.match.any,
      sinon.match.any,
      {auth: {username: 'user', password: 'password'}}
    );
  })

})
