const gitclone = require('git-clone');

module.exports = (repository, branch, targetPath) => {
  const cloneOptions = {}

  return new Promise( (resolve, reject) => {

    if (branch) {
      cloneOptions.checkout = branch
    }

    gitclone(repository, targetPath, cloneOptions, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });

  })
}
