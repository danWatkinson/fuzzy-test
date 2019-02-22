const fs = require('fs');

module.exports = (options) => {
  const {config} = options;

  function readConfigFile(config) {
    return JSON.parse( fs.readFileSync(config, {encoding:'utf-8'}) );
  }


  function applyCommandlineArgsToConfig(parsedConfig) {
    parsedConfig.
  }

  const configFile = readConfigFile(config);

  const combinedConfig = {
    ...options, ...{config: configFile}
  }

  return combinedConfig;
}
