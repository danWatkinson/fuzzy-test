const fs = require('fs');
const path = require('path');
const prependFile = require('prepend-file')

module.exports = (locationOfAllFeatures, executionId) => {
  fs.readdirSync(locationOfAllFeatures)
     .filter( filename => filename.endsWith('.feature') )
     .map( filename => path.join(locationOfAllFeatures, filename ) )
     .forEach( (featureFile) => {
        prependFile.sync(featureFile, `@${executionId}\n`)
     });

}
