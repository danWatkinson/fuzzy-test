const expect = require('../../test/test-hooks').expect;

const mergeBackground = require('./mergeBackground');

describe('mergeBackground', () => {
  it('merges background steps into the owning scenarios steps', () => {
    const elementsIncludingABackground = [
      {"name": "", "type": "background", "steps": [{ "result": { "duration": 10058, "status": "passed"}}]},
      {"name": "Users can perform a search", "type": "scenario", "steps": [{"result": { "duration": 4770, "status": "passed"}}]}
    ];

    const expectedElementsOut = [
      { "name": "Users can perform a search", "type": "scenario", "steps": [
        {"result": { "duration": 10058, "status": "passed"}},
        {"result": { "duration": 4770, "status": "passed"}}
      ]}
    ];

    expect( mergeBackground(elementsIncludingABackground) ).to.deep.equal( expectedElementsOut );

  })
});
