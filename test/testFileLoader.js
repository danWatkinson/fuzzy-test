const fs = require('fs');
const path = require('path');

module.exports = (options) => {

  const { fileRoot } = options;

  const loadFile = (relativeFilePath) => {
    const file = path.resolve(fileRoot, relativeFilePath);
    return fs.readFileSync(file, 'utf-8');

  };

  return Object.freeze({
    loadFile
  });
}
