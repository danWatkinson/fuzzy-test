const pluginManager = require('../../../pluginManager');

const pluginConfiguration = {
  git: require('./git')
}

module.exports = (config) => {
  return pluginManager(config, pluginConfiguration)
          .executePlugins();
}
