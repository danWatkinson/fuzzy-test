const fse = require('fs-extra');

module.exports = (options) => {

  const {targetPath} = options;

  const clear = () => {
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

  return Object.freeze({
    clear
  });
}
