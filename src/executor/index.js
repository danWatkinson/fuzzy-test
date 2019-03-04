const pluginManager = require('../pluginManager');

const pluginConfiguration = {
  docker: require('./docker')
}

module.exports = (config) => {

  return pluginManager(config, pluginConfiguration)
          .executePlugins();
}
