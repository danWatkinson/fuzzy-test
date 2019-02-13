const axios = require('axios');
const searchUrlBuilder = require('./searchUrlBuilder');

module.exports = (options) => {
  const {summary} = options;

  const urlBuilder = searchUrlBuilder(options);
  const url = urlBuilder.build(summary);

  const execute = async() => {
    const response = await axios.get( url, {auth: options});

    const foundJiraIssues = response.data.issues;

    if (foundJiraIssues.length > 1) {
      throw ('found multiple test-plans matching ' + summary);
    } else {
      return foundJiraIssues[0] ? foundJiraIssues[0].key : null;
    }
  }

  return Object.freeze({
      execute
  });

}
