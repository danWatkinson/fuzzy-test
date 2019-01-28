const chai = require('chai');
const sinonChai = require('sinon-chai');

const assertArrays = require('chai-arrays');
chai.use(assertArrays);
chai.use(sinonChai);

module.exports = {
  expect: chai.expect
}
