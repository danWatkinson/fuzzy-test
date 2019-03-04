module.exports = (config, plugins) => {
  const requested = Object.keys(config);
  const configured = [];
  const missing = [];

  const executePlugins = () => {
    const executingPlugins = [];
    configured.forEach( (plugin) => {
      executingPlugins.push(plugin.execute())
    })

    return Promise.all(executingPlugins);
  }

  requested.forEach( (requestedPlugin) => {
    if (!plugins[requestedPlugin]) {
      missing.push(requestedPlugin);
    } else {
      const foundPlugin = plugins[requestedPlugin];
      const configurationForPlugin = config[requestedPlugin];
      const configuredPlugin = foundPlugin(configurationForPlugin);

      configured.push(configuredPlugin);
    }
  });

  if (missing.length >0) {
    throw(`Failed to parse tests. No handler for requested: ${missing}`);
  }

  return Object.freeze({
    executePlugins
  });
}
