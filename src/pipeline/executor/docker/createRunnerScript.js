const fs = require('fs');
const path = require('path');

const runnerScriptArgsBuilder = require('./runnerScriptArgsBuilder');

module.exports = (config) => {
  const {imageRoot, relativeScriptPath, command, args} = config;
  const filename = path.join(imageRoot, relativeScriptPath);

  console.log(`creating script runner: ${filename}`);

  const arguments = runnerScriptArgsBuilder(config.args);

  const header = "# /usr/share/maven/bin/mvn";
  const fileContent = `${header}\n\n${command} ${arguments}\n`;

  return new Promise( (resolve, reject) => {
    fs.writeFile(filename, fileContent, function(err) {
    if(err) {
        reject(err);
    }

    fs.chmodSync(filename, 777);

    resolve();
    });
  })

}
