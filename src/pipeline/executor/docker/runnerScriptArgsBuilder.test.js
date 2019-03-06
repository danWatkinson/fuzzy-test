const expect = require('../../../../test/test-hooks').expect;

const argsBuilder = require('./runnerScriptArgsBuilder');

describe('argsBuilder', () => {
  it('turns {a:"1", b:"2"} into -Da="1" -Db="2"', () => {
    expect(argsBuilder({a:"1", b:"2"})).to.equal('-Da="1" -Db="2"')
  })
})
