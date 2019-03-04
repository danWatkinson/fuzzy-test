const fs = require('fs');
const path = require('path');

const applyMappings = require('./applyMappings');

module.exports = (options) => {
  const {config} = options;

  function read(config) {
    return JSON.parse(
      fs.readFileSync( path.resolve(config), {encoding:'utf-8'} )
    );
  }

  const combinedConfig = {
    ...options, ...process.env, ...read(config)
  }

  return applyMappings(combinedConfig);
}
