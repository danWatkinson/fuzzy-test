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

  it('flags missing references', () => {
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
          mappedValue: '<unmatched mapping: aRootValue>'
        }
      }
    }

    expect(applyInternalMappings(exampleConfig)).to.deep.equal(expectedResult);
  })

  it('can handle multiple mappings in a single node', () => {
    const exampleConfig = {
      aRootValue: 'ABC-123',
      anotherRootValue: 'DEF-456',
      nestedOnce: {
        nestedTwice: {
          mappedValue: 'blah blah ${aRootValue} blah blah ${anotherRootValue}'
        }
      }
    }

    const expectedResult = {
      aRootValue: 'ABC-123',
      anotherRootValue: 'DEF-456',
      nestedOnce: {
        nestedTwice: {
          mappedValue: 'blah blah ABC-123 blah blah DEF-456'
        }
      }
    }

    expect(applyInternalMappings(exampleConfig)).to.deep.equal(expectedResult);
  })

  it('can handle dot-delimited mappings', () => {
    const exampleConfig = {
      in: {
        more: 'AAA-111'
      },
      nestedOnce: {
        nestedTwice: {
          mappedValue: 'blah blah ${in.more}'
        }
      }
    }

    const expectedResult = {
      in: {
        more: 'AAA-111'
      },
      nestedOnce: {
        nestedTwice: {
          mappedValue: 'blah blah AAA-111'
        }
      }
    }

    expect(applyInternalMappings(exampleConfig)).to.deep.equal(expectedResult);
  })
})
