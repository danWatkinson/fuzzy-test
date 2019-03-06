const fs = require('fs');
const path = require('path');
const prependFile = require('prepend-file')

module.exports = (locationOfAllFeatures, executionId) => {
  const featureFiles = fs.readdirSync(locationOfAllFeatures)
             .filter( filename => filename.endsWith('.feature') )
             .map( filename => path.join(locationOfAllFeatures, filename ) );

  for(var i=0; i<featureFiles.length; i++) {
    prependFile.sync(featureFiles[i], `@${executionId}\n`)
  }
}
