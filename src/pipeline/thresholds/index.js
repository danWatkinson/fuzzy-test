const pluginManager = require('../../pluginManager');

const pluginConfiguration = {
  cucumber: require('./cucumber')
}

module.exports = (config) => {
  return pluginManager(config, pluginConfiguration)
          .executePlugins();
}
