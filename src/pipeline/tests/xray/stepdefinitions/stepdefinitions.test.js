const expect = require('../../../../../test/test-hooks').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockExecutePlugins = sinon.stub();
const mockPluginManager = sinon.stub();

const executor = proxyquire('./index', {
  '../../../../pluginManager': mockPluginManager
});

describe('reporting', () => {

  beforeEach( () => {
    mockPluginManager.reset();
    mockExecutePlugins.reset();

    mockPluginManager.returns({
      executePlugins: mockExecutePlugins
    });

  });

  it('configures the pluginManager with the provided config', () => {
    executor({some:'config'});

    expect( mockPluginManager ).to.have.been.calledWith(
       {some:'config'},
       sinon.match.any
     );
  });

  it('executes the pluginManager', () => {
    executor({some:'config'});

    expect( mockExecutePlugins ).calledOnce;
  });

  it('returns the result of executing the pluginManager', () => {
    const somePromise = new Promise(()=>{});

    mockExecutePlugins.returns(somePromise);

    expect( executor({some:'config'}) ).to.equal(somePromise);
  });

  it('supports "git"', () => {
    executor({some:'config'});

    const providedPlugins = mockPluginManager.getCall(0).args[1];
    const pluginNames = Object.keys(providedPlugins);

    expect(pluginNames).to.contain('git');
  });
});
