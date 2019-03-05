const sinon = require('sinon');
const expect = require('../test/test-hooks').expect;

const pluginManager = require('./pluginManager');

describe('pluginManager', () => {
  describe('instatiated with a config object and a list of plugins it respects', () => {
    let config, plugins;

    let plugin1 = sinon.stub();
    let plugin1Execute = sinon.stub();

    let plugin2 = sinon.stub();
    let plugin2Execute = sinon.stub();


    beforeEach( () => {
      config = {
        plugin1: {
          plugin1Feature1: 'A',
          plugin1Feature2: 'B'
        },
        plugin2: {
          plugin2Feature1: '1',
          plugin2Feature2: '2'
        }
      }

      plugin1.reset();
      plugin1Execute.reset();
      plugin1.returns({execute: plugin1Execute})

      plugin2.reset();
      plugin2Execute.reset();
      plugin2.returns({execute: plugin2Execute})

      plugins = {
        plugin1: plugin1,
        plugin2: plugin2
      }

    });

    it('instantiates each provided plugin with its configuration', () => {
      pluginManager(config, plugins);

      expect(plugin1).to.have.been.calledWith({
        plugin1Feature1: 'A',
        plugin1Feature2: 'B'
      });

      expect(plugin2).to.have.been.calledWith({
        plugin2Feature1: '1',
        plugin2Feature2: '2'
      });
    });

    it('throws if the config and plugins dont match..', (done) => {
      const overOptimisticConfig = {
        ...config,
        plugin3: {not:'here'},
        plugin4: {same:'same'}
      }

      try {
        pluginManager(overOptimisticConfig, plugins)
      } catch(error) {
        expect(error).to.equal('Failed to parse tests. No handler for requested: plugin3,plugin4');
        done();
      };
    });

    it('executePlugins calls execute on all the plugins..', async() => {
      await pluginManager(config, plugins).executePlugins();

      expect(plugin1Execute).to.have.been.calledOnce;
      expect(plugin2Execute).to.have.been.calledOnce;
    })

  })
});
