const path = require('path');
const fs = require('fs');

module.exports = (options) => {

  const { reportDirectory } = options;

  const list = () => {
    return fs.readdirSync(reportDirectory)
             .filter( filename => filename.endsWith('.json') )
             .map( filename => path.join(reportDirectory, filename ) );
  }

  return Object.freeze({
    list
  });

}
