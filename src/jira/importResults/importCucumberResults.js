const fs = require('fs');
const archiver = require('archiver');
const FormData = require('form-data');
const axios = require('axios');


module.exports = (config) => {
  const {hostname, username, password, reportsDir} = config;
  const zipFile = `${reportsDir}/results.zip`;
  const auth = {
    "username": username,
    "password": password
  };

  const zipResults = async() => {
    return new Promise( (resolve, reject) => {
      const output = fs.createWriteStream(zipFile);
      const archive = archiver('zip');

      output.on('close', function () {
        resolve();
      });

      archive.on('error', function(err){
        reject(err);
      });

      archive.pipe(output);
      archive.glob(`${reportsDir}/*.json`);

      archive.finalize();
    });
  };

  const postResults = async() => {
    const form = new FormData();
    form.append('file', fs.createReadStream(zipFile));

    const url = `${hostname}/rest/raven/1.0/import/execution/bundle`;

    await axios({
      url,
      method: 'POST',
      auth: auth,
      headers: form.getHeaders(),
      data: form
    });

  };

  const report = async() => {
    await zipResults();
    await postResults();
  }

  return Object.freeze({
    report
  });
}
