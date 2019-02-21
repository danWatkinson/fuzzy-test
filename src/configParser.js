const fs = require('fs');

module.exports = (options) => {
  const {config} = options;

  const configFile = JSON.parse( fs.readFileSync(config, {encoding:'utf-8'}) );

  const combinedConfig = {
    ...options, ...{config: configFile}
  }

  return combinedConfig;
}
