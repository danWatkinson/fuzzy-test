const expect = require('../../test/test-hooks').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockOptions = require('../../test/commanderStub');
const mockConfigParser = sinon.stub();
const mockTests = sinon.stub();
const mockExecutor = sinon.stub();
const mockReporting = sinon.stub();
const mockThresholds = sinon.stub();
const mockProcessExit = sinon.stub();

let processArgCache;
let processExitCache;

describe('cli-test-pipeline', () => {

  const executeScript = () => {
    return proxyquire('./cli-test-pipeline', {
      'commander': mockOptions,
      './configuration/configParser': mockConfigParser,
      '../pipeline/tests': mockTests,
      '../pipeline/executor': mockExecutor,
      '../pipeline/reporting': mockReporting,
      '../pipeline/thresholds': mockThresholds
    });
  };

  beforeEach( () => {
    processExitCache = process.exit;
    process.exit = mockProcessExit;

    processArgCache = process.argv;

    mockConfigParser.returns({
      tests: {dummy:'tests-data'},
      executor: {dummy:'executor-data'},
      reporting: {dummy:'reporting-data'},
      thresholds: {dummy:'thresholds-data'}
    });

  });

  afterEach( () => {
    process.argv = processArgCache;
    process.exit = processExitCache;
  });

  it('passes process.argv into "commander" to break into a meaningful options object', () => {
    executeScript();

    expect( mockOptions.parse ).to.have.been.calledWith( process.argv );
  });

  it('passes the parsed options to configParser', () => {
    executeScript();

    expect(mockConfigParser).to.have.been.calledWith(mockOptions);
  });

  it('passes options.tests to the tests', () => {
    executeScript();

    expect(mockTests).to.have.been.calledWith({dummy:'tests-data'});
  });

  it('passes options.reporting to the reporting', () => {
    executeScript();

    expect(mockReporting).to.have.been.calledWith({dummy:'reporting-data'});
  });

  it('passes options.thresholds to the thresholds', () => {
    executeScript();

    expect(mockThresholds).to.have.been.calledWith({dummy:'thresholds-data'});
  });

});
