const expect = require('../../../test/test-hooks').expect;

const applyMappings = require('./applyMappings');

describe('applyMappings', () => {
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

    expect(applyMappings(exampleConfig)).to.deep.equal(expectedResult);
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

    expect(applyMappings(exampleConfig)).to.deep.equal(expectedResult);
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

    expect(applyMappings(exampleConfig)).to.deep.equal(expectedResult);
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

    expect(applyMappings(exampleConfig)).to.deep.equal(expectedResult);
  })

  it('can move entire blocks around', () => {
    const exampleConfig = {
      plugin: {
        jira: {
          hostname: "https://127.0.0.1",
          username: "user",
          password: "bob"
        }
      },
      tests: {
        xray: {
          jira: '${plugin.jira}'
        }
      }
    }

    const expectedResult = {
      plugin: {
        jira: {
          hostname: "https://127.0.0.1",
          username: "user",
          password: "bob"
        }
      },
      tests: {
        xray: {
          jira: {
            hostname: "https://127.0.0.1",
            username: "user",
            password: "bob"
          }
        }
      }
    }

    expect(applyMappings(exampleConfig)).to.deep.equal(expectedResult);
  })

})
