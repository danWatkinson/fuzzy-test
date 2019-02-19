const clone = require('git-clone');
const clearTargetFolder = require('./clearTargetFolder');

module.exports = (options) => {
  const clear = clearTargetFolder(options).clear;

  const {repository, targetPath, branch} = options;
  const cloneOptions = {}

  const performClone = async() => {
    console.log(`cloning ${repository} :: ${branch} into ${targetPath}`)

    await clear();

    return new Promise( (resolve, reject) => {

      if (branch) {
        cloneOptions.checkout = branch
      }

      clone(repository, targetPath, cloneOptions, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      });

    })

  }

  return Object.freeze({
    performClone
  });
}
