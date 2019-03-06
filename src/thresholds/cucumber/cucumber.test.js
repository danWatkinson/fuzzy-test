const expect = require('../../../test/test-hooks').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockCombinedReport = sinon.stub();
const mockLoader = sinon.stub();
const mockScenarios = sinon.stub();

const mockReportAnalyser = sinon.stub();
const mockAnalyse = sinon.stub();

const cucumber = proxyquire('./index', {
  './combinedReport': mockCombinedReport,
  './reportAnalyser': mockReportAnalyser
})

describe('/thresholds/cucumber(config).execute()', () => {

    beforeEach( () => {
      mockLoader.reset();
      mockScenarios.reset();
      mockCombinedReport.reset();
      mockCombinedReport.returns({
        load: mockLoader,
        scenarios: mockScenarios
      });

      mockAnalyse.reset();
      mockReportAnalyser.reset();
      mockReportAnalyser.returns({analyse: mockAnalyse});
    });

    it('creates a combinedReport using the provided config', async () => {
      await cucumber({some:'config'}).execute();;

      expect(mockCombinedReport).to.have.been.calledWith({some:'config'});
    });

    it('loads the combined report', async () => {
      await cucumber({some:'config'}).execute();;

      expect(mockLoader).to.have.been.calledWith();
    });

    it('creates an analyser using the provided config', async () => {
      await cucumber({some:'config'}).execute();;

      expect(mockReportAnalyser).to.have.been.calledWith({some:'config'});
    });

    it('analyses the scenarios in the combined report', async () => {
      mockScenarios.returns({some:'scenarios'})

      await cucumber({some:'config'}).execute();;

      expect(mockAnalyse).to.have.been.calledWith({some:'scenarios'});
    });

    it('returns the result of the analysis', async () => {
      mockAnalyse.returns('passed');

      const result = await cucumber({some:'config'}).execute();;

      expect(result).to.equal('passed');
    });

});
