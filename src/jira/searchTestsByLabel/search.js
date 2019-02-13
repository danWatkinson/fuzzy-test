const axios = require('axios');
const searchUrlBuilder = require('./searchUrlBuilder');

module.exports = (options) => {
  const urlBuilder = searchUrlBuilder(options);

  const execute = async() => {
    const response = await axios.get( urlBuilder.build(), {auth: options});

    return response.data.issues.map( (issue) => {return issue.key} );
  }

  return Object.freeze({
    execute
  });
}
