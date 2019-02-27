const fse = require('fs-extra');

module.exports = (targetPath) => {
  return new Promise( (resolve, reject) => {
    fse.emptyDir(targetPath, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  })
}
