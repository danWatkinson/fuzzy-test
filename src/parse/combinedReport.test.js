const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');
const expect = require('../../test/test-hooks').expect;

const listStub = sinon.stub();
const fileProviderStub = sinon.stub();
fileProviderStub.returns({
  list: listStub
});

const parseStub = sinon.stub();
const reportParserStub = sinon.stub();
reportParserStub.returns({
  parse: parseStub
});

const combinedReport = proxyquire('./combinedReport', {
   './fileProvider': fileProviderStub,
   './reportParser': reportParserStub
 });


describe('combinedReport(options)', () => {

  const dummyOptions = {reportDirectory: './someDirectory'};

  it('uses fileProvider', () => {
    combinedReport(dummyOptions);
    expect(fileProviderStub).to.have.been.calledWith(dummyOptions);
  });

  it('uses reportParser', () => {
    combinedReport(dummyOptions);
    expect(reportParserStub).to.have.been.calledWith(dummyOptions);
  });

  describe('.load()', () => {
    it('passes the results of fileProvider.list() to reportParser', async () => {
      listStub.returns(['file1.json', 'file2.json']);

      await combinedReport(dummyOptions).load();

      expect(parseStub).to.have.been.calledWith('file1.json');
      expect(parseStub).to.have.been.calledWith('file2.json');
    });
  });

  describe('.scenarios()', () => {

    it('resolves with a concat of all the results from the reportParser in a single array', async () => {
      listStub.returns(['file1.json', 'file2.json']);

      parseStub.reset();
      parseStub.onFirstCall().returns(['one']);
      parseStub.onSecondCall().returns(['two']);

      const report = combinedReport(dummyOptions)
      report.load();

      expect(report.scenarios()).to.be.equalTo(['one', 'two']);
    });

  });

});
