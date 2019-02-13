const expect = require('../../../test/test-hooks').expect;

const searchUrlBuilder = require('./searchUrlBuilder');

describe('searchUrlBuilder(options).build(searchTerms)', () => {

  describe('creates the url for the search endpoint based on options.hostname', () => {
    it('builds an empty search if provided with no searchTerms', async() => {
      const url = searchUrlBuilder(
        {hostname: 'https://jira-dev.intdigital.ee.co.uk'}
      ).build();

      expect(url).to.equal('https://jira-dev.intdigital.ee.co.uk/rest/api/2/search');
    });

    it('can build a search for one label', async() => {
      const url = searchUrlBuilder({
        hostname: 'https://jira-dev.intdigital.ee.co.uk',
        labels: 'Marketing_Tribe'
      }).build();

      expect(url).to.equal('https://jira-dev.intdigital.ee.co.uk/rest/api/2/search?jql=labels%20%3D%20Marketing_Tribe');
    });

    it('can build a search for many labels', async() => {
      const url = searchUrlBuilder({
        hostname: 'https://jira-dev.intdigital.ee.co.uk',
        labels: 'Marketing_Tribe,Functional,bananas'
      }).build();

      expect(url).to.equal('https://jira-dev.intdigital.ee.co.uk/rest/api/2/search?jql=labels%20%3D%20Marketing_Tribe%20AND%20labels%20%3D%20Functional%20AND%20labels%20%3D%20bananas');
    });

  });
});
