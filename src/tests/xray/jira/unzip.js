const extract = require('extract-zip')
const path = require('path');

module.exports = async(zip, targetPath) => {
  return new Promise( (resolve, reject) => {
    extract(zip, {dir: path.resolve(targetPath)}, function (err) {
     if (err) reject(err);
     resolve();
    })
  });
}
