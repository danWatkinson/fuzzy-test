const path = require('path');

const chai = require('chai');
const sinonChai = require('sinon-chai');

const assertArrays = require('chai-arrays');
const chaiString = require('chai-string');

chai.use(assertArrays);
chai.use(sinonChai);
chai.use(chaiString);

const testFileLoader = require('./testFileLoader');
const testResources = path.resolve(__dirname, '../resources');

module.exports = {
  expect: chai.expect,
  loadFile: testFileLoader({fileRoot:testResources}).loadFile
}
