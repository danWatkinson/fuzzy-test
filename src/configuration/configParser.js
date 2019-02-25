const fs = require('fs');
const applyMappings = require('./applyMappings');

module.exports = (options) => {
  const {config} = options;

  const configFile = JSON.parse( fs.readFileSync(config, {encoding:'utf-8'}) );

  const combinedConfig = {
    ...options, ...process.env, ...configFile
  }

  return applyMappings(combinedConfig);
}
