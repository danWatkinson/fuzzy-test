const expect = require('../../../test/test-hooks').expect;
const mock = require('mock-fs');
const path = require('path');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockApplyMappings = sinon.stub();

const configParser = proxyquire('./configParser', {
  './applyMappings': mockApplyMappings
});

describe('configParser(options)', () => {

  let oldProcessEnv;

  beforeEach( () => {
    oldProcessEnv = process.env;
    mockApplyMappings.reset();
  })

  afterEach( () => {
    process.env = oldProcessEnv;
  })

  it('merges "options", "process.env", and the content of the provided "options.config", and passes the resulting object into applyMappings', () => {
    const mockFiles = {};
    const mockedFile = path.resolve('someFolder/config.json');
    mockFiles[mockedFile] = '{"name":"value"}'
    mock(mockFiles);

    const options = {
      config: mockedFile,
      someOtherConfig: 'someOtherValue'
    }

    process.env = {
      someEnvVariable: 'someEnvValue'
    }

    configParser(options);

    expect(mockApplyMappings).to.have.been.calledWith({
      config: mockedFile,
      name: 'value',
      someOtherConfig: 'someOtherValue',
      someEnvVariable: 'someEnvValue'
    });

  });

  it('returns the results of applyMappings', () => {
    const mockFiles = {};
    const mockedFile = path.resolve('someFolder/config.json');
    mockFiles[mockedFile] = '{"name":"value"}'
    mock(mockFiles);

    const options = {
      config: mockedFile,
      someOtherConfig: 'someOtherValue'
    }

    mockApplyMappings.returns({some:'data'});

    expect( configParser(options) ).to.deep.equal( {some:'data'} )
  })
});
