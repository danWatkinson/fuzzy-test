const expect = require('../../test/test-hooks').expect;

const applyInternalMappings = require('./applyInternalMappings');

describe('applyInternalMappings', () => {
  it('replaces simple references', () => {
    const exampleConfig = {
      aRootValue: 'ABC-123',
      nestedOnce: {
        nestedTwice: {
          mappedValue: '${aRootValue}'
        }
      }
    }

    const expectedResult = {
      aRootValue: 'ABC-123',
      nestedOnce: {
        nestedTwice: {
          mappedValue: 'ABC-123'
        }
      }
    }

    expect(applyInternalMappings(exampleConfig)).to.deep.equal(expectedResult);
  })

  it('leaves missing references unchanged', () => {
    const exampleConfig = {
      nestedOnce: {
        nestedTwice: {
          mappedValue: '${aRootValue}'
        }
      }
    }

    const expectedResult = {
      nestedOnce: {
        nestedTwice: {
          mappedValue: '${aRootValue}'
        }
      }
    }

    expect(applyInternalMappings(exampleConfig)).to.deep.equal(expectedResult);
  })

  xit('can handle multiple mappings in a single node', () => {
    const exampleConfig = {
      aRootValue: 'ABC-123',
      aotherRootValue: 'DEF-456',
      nestedOnce: {
        nestedTwice: {
          mappedValue: 'blah blah "${aRootValue}" blah blah ${aotherRootValue}'
        }
      }
    }

    const expectedResult = {
      aRootValue: 'ABC-123',
      aotherRootValue: 'DEF-456',
      nestedOnce: {
        nestedTwice: {
          mappedValue: 'blah blah "ABC-123" blah blah DEF-456'
        }
      }
    }

    expect(applyInternalMappings(exampleConfig)).to.deep.equal(expectedResult);
  })
})
