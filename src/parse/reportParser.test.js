const path = require('path');
const expect = require('../../test/test-hooks').expect;

const reportParser = require('./reportParser');
const testResources = path.resolve(__dirname, '../../resources/testoutput');

describe('reportParser(options).parse(file)', () => {

  it('loads one feature, one scenario, one passing step', () => {
    const testFile = path.resolve(testResources, 'OneFeature_OneScenario_OneStep_Passing/1.json');

    const report = reportParser({}).parse(testFile);

    expect(report).to.deep.equal([[
      {name: 'A Passing Scenario', result: 'passed'}
    ]]);
  });

  it('loads one feature, one scenario, one failing step', () => {
    const testFile = path.resolve(testResources, 'OneFeature_OneScenario_OneStep_Failing/1.json');

    const report = reportParser({}).parse(testFile);

    expect(report).to.deep.equal([[
      {name: 'A Failing Scenario', result: 'failed'}
    ]]);
  });

  it('loads one feature, one passing scenario, one failing scenario', () => {
    const testFile = path.resolve(testResources, 'OneFeature_OnePassingScenario_OneFailingScenario/1.json');

    const report = reportParser({}).parse(testFile);

    expect(report).to.deep.equal([[
      {name: 'A Passing Scenario', result: 'passed'},
      {name: 'A Failing Scenario', result: 'failed'}
    ]])
  });

  it('loads one feature, one scenario, some steps skipped', () => {
    const testFile = path.resolve(testResources, 'OneFeature_OneScenario_SomeStepsSkipped/1.json');

    const report = reportParser({}).parse(testFile);

    expect(report).to.deep.equal([[
      {name: 'Users can perform a search', result: 'failed'}
    ]]);
  });

  it('loads one feature, one scenario with background, passing', () => {
    const testFile = path.resolve(testResources, 'OneFeature_OneScenario_Background_Passing/1.json');

    const report = reportParser({}).parse(testFile);

    expect(report[0].length).to.equal(1);
  });
});
