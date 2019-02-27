const pluginManager = require('../pluginManager');

const pluginConfiguration = {
  cucumber: require('./cucumber')
}

module.exports = (config) => {
  const plugins = pluginManager(config, pluginConfiguration);

  const executePlugins = () => {
    const executingPlugins = [];
    plugins.forEach( (plugin) => {
      const promiseForPlugin = plugin.execute();
      executingPlugins.push(promiseForPlugin)
    })

    return Promise.all(executingPlugins);
  }

  return Object.freeze({
    executePlugins
  })
}
