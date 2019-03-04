const archiver = require('archiver');
const fs = require('fs');


module.exports = async(fileGlob, temporaryZip) => {
  return new Promise( (resolve, reject) => {
    const output = fs.createWriteStream(temporaryZip);
    const archive = archiver('zip');

    output.on('close', function () {
      resolve();
    });

    archive.on('error', function(err){
      reject(err);
    });

    archive.pipe(output);
    archive.glob(fileGlob);

    archive.finalize();
  });
};
