const sinon = require('sinon');

const stub = {};

stub['version'] = sinon.stub();
stub['version'].returns(stub);

stub['option'] = sinon.stub();
stub['option'].returns(stub);

stub['parse'] = sinon.stub();
stub['parse'].returns(stub);

module.exports = stub;
