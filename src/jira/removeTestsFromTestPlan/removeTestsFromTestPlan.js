const axios = require('axios');
const removeUrlBuilder = require('./removeUrlBuilder');

module.exports = (options) => {

  const urlBuilder = removeUrlBuilder(options);

  const remove = async(testPlanKey, listOfTests) => {

    // try {
      await axios.post(urlBuilder.build(testPlanKey),
        {remove: listOfTests},
        {auth: options}
      );
    // } catch(error) {
    //   console.error(error);
    // }

  }

  return Object.freeze({
    remove
  });
}
