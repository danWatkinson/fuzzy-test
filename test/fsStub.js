const sinon = require('sinon');

const createWriteStream = sinon.stub();

const reset = () => {
  createWriteStream.reset();
}

module.exports = {
  createWriteStream,
  reset
}
