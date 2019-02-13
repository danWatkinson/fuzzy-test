const axios = require('axios');

const payloadBuilder = require('./payloadBuilder');
const urlBuilder = require('./urlBuilder');

module.exports = (options) => {

  const payload = payloadBuilder(options);
  const url = urlBuilder(options);

  const execute = async() => {
    const response = await axios.post( url, payload, {auth: options});

    return response;
  }

  return Object.freeze({
    execute
  })
}
