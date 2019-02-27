const expect = require('../../../test/test-hooks').expect;

const reportAnalyser = require('./reportAnalyser');

describe( 'reportAnalyser(options)', () => {
  it('passes if report.success-count / report.total-count = options.threshold', () => {

    const options = {threshold: 0.5};

    const analyser = reportAnalyser(options);

    const result = analyser.analyse([[
      { name: 'A Passing Scenario', result: 'passed' },
      { name: 'A Failing Scenario', result: 'failed' }
    ]]);

    expect(result).to.equal('passed');
  });

  it('passes if report.success-count / report.total-count > options.threshold', () => {

    const options = {threshold: 0.4};

    const analyser = reportAnalyser(options);

    const result = analyser.analyse([[
      { name: 'A Passing Scenario', result: 'passed' },
      { name: 'A Failing Scenario', result: 'failed' }
    ]]);

    expect(result).to.equal('passed');
  });

  it('fails if report.success-count / report.total-count < options.threshold', () => {

    const options = {threshold: 0.6};

    const analyser = reportAnalyser(options);

    const result = analyser.analyse([[
      { name: 'A Passing Scenario', result: 'passed' },
      { name: 'A Failing Scenario', result: 'failed' }
    ]]);

    expect(result).to.equal('failed');
  });
});
