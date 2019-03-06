const pluginManager = require('../../pluginManager');

const pluginConfiguration = {
  xray: require('./xray')
}

module.exports = (config) => {
  return pluginManager(config, pluginConfiguration)
          .executePlugins();
}
