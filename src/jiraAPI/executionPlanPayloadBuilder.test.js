const expect = require('../../test/test-hooks').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockTimestamp = sinon.stub();

const executionPlanPayloadBuilder = proxyquire('./executionPlanPayloadBuilder', {
  'time-stamp': mockTimestamp
});

describe('executionPlanPayloadBuilder(options)', () => {
  it('adds project field to the created test-plan', () => {
    const payload = executionPlanPayloadBuilder({project:'myProjectName'});

    expect(payload.fields.project.key).to.equal('myProjectName');
  })

  it('adds summary field to the created test-plan', () => {
    mockTimestamp.returns('2019/03/05 15:17:51:637')
    const payload = executionPlanPayloadBuilder({summary:'mySummary'});

    expect(payload.fields.summary).to.equal('mySummary : 2019/03/05 15:17:51:637');
  })

  it('adds auto-creates a description field based on summary', () => {
    const payload = executionPlanPayloadBuilder({summary:'mySummary'});

    expect(payload.fields.description).to.equal('auto-created test-execution for mySummary');
  })

  it('adds defaults issue-type to "Test Plan"', () => {
    const payload = executionPlanPayloadBuilder({});

    expect(payload.fields.issuetype.name).to.equal('Test Execution');
  })

  it('adds customfield_16546 to the created test plan, based on provided squad information', () => {
    const payload = executionPlanPayloadBuilder({tribe:"shop"});

    expect(payload.fields.customfield_16546.value).to.equal('shop');
  })

  it('adds customfield_16546.child to the created test plan, based on provided squad information', () => {
    const payload = executionPlanPayloadBuilder({squad:"squad1"});

    expect(payload.fields.customfield_16546.child.value).to.equal('squad1');
  })

  it('adds components to the created test plan, based on provided comma-separated list', () => {
    const payload = executionPlanPayloadBuilder({components:["web","aem_somethingorother"]});

    expect(payload.fields.components).to.deep.equal([
      { "name": "web" },
      { "name": "aem_somethingorother" },
    ]);
  })

})
