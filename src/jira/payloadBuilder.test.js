const expect = require('../../test/test-hooks').expect;

const payloadBuilder = require('./payloadBuilder');

describe('payloadBuilder(options)', () => {
  it('adds project field to the created test-plan', () => {
    const payload = payloadBuilder({project:'myProjectName'});

    expect(payload.fields.project.key).to.equal('myProjectName');
  })

  it('adds summary field to the created test-plan', () => {
    const payload = payloadBuilder({summary:'mySummary'});

    expect(payload.fields.summary).to.equal('mySummary');
  })

  it('adds auto-creates a description field based on summary', () => {
    const payload = payloadBuilder({summary:'mySummary'});

    expect(payload.fields.description).to.equal('auto-created test-plan for mySummary');
  })

  it('adds defaults issue-type to "Test Plan"', () => {
    const payload = payloadBuilder({});

    expect(payload.fields.issuetype.name).to.equal('Test Plan');
  })

  it('adds customfield_16546 to the created test plan, based on provided squad information', () => {
    const payload = payloadBuilder({squad:"shop:squad1"});

    expect(payload.fields.customfield_16546.value).to.equal('shop');
  })

  it('adds customfield_16546.child to the created test plan, based on provided squad information', () => {
    const payload = payloadBuilder({squad:"shop:squad1"});

    expect(payload.fields.customfield_16546.child.value).to.equal('squad1');
  })

  it('adds components to the created test plan, based on provided comma-separated list', () => {
    const payload = payloadBuilder({components:"web,aem_somethingorother"});

    expect(payload.fields.components).to.deep.equal([
      { "name": "web" },
      { "name": "aem_somethingorother" },
    ]);
  })

})
