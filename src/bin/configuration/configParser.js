const fs = require('fs');
const path = require('path');

const applyMappings = require('./applyMappings');

module.exports = (options) => {
  const {config} = options;

  const absoluteConfig = path.resolve(config);

  const configFile = JSON.parse( fs.readFileSync(absoluteConfig, {encoding:'utf-8'}) );

  const combinedConfig = {
    ...options, ...process.env, ...configFile
  }

  return applyMappings(combinedConfig);
}
