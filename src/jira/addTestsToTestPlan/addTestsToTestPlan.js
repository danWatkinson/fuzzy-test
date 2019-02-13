const axios = require('axios');
const addUrlBuilder = require('./addUrlBuilder');

module.exports = (options) => {

  const urlBuilder = addUrlBuilder(options);

  const add = async(testPlanKey, listOfTests) => {

    // try {
      await axios.post(urlBuilder.build(testPlanKey),
        {add: listOfTests},
        {auth: options}
      );
    // } catch(error) {
    //   console.error(error);
    // }
    
  }

  return Object.freeze({
    add
  });
}
