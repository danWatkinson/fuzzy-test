const axios = require('axios');
const listUrlBuilder = require('./listUrlBuilder');

module.exports = (options) => {
  const urlBuilder = listUrlBuilder(options);

  const list = async(testPlanKey) => {
    const response = await axios.get(urlBuilder.build(testPlanKey), {auth: options});

    return response.data.map( (test) => {return test.key} )
  }

  return Object.freeze({
    list
  });
}
