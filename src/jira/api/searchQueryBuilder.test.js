const expect = require('../../../test/test-hooks').expect;

const searchQueryBuilder = require('./searchQueryBuilder');

describe('searchQueryBuilder(labels)', () => {

  describe('creates the url for the search endpoint based on options.hostname', () => {

    it('can build a search for many labels', async() => {
      const url = searchQueryBuilder(['Marketing_Tribe','Functional','bananas']);

      expect(url).to.equal('jql=labels%20%3D%20Marketing_Tribe%20AND%20labels%20%3D%20Functional%20AND%20labels%20%3D%20bananas');
    });

  });
});
