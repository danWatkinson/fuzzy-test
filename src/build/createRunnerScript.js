const fs = require('fs');
const chmod = require('chmod');

const runnerScriptArgsBuilder = require('./runnerScriptArgsBuilder');

module.exports = (config) => {
  const {targetPath, command} = config;
  const fileName = `${targetPath}/runMaven.sh`;

  console.log(`creating script runner: ${fileName}`);

  // example POC values..
  const {perfectoToken} = config;

  const arguments = runnerScriptArgsBuilder(config.args);

  // the things we want to put into our shell-script
  const header = "# /usr/share/maven/bin/mvn"
  const mvnCommand = `${command} ${arguments}`

  const fileContent = `${header}\n\n${mvnCommand}\n`;

  return new Promise( (resolve, reject) => {
    fs.writeFile(fileName, fileContent, function(err) {
    if(err) {
        reject(err);
    }

    chmod(fileName, 777);

    resolve();
    });
  })

}
