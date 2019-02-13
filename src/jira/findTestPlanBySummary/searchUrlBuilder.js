var querystring = require("querystring")

module.exports = (options) => {
   const { hostname } = options;

   const build = (summary) => {
     const jql = querystring.stringify({jql: 'summary ~ "' + summary +'"'});

     return hostname + '/rest/api/2/search?' + jql;
  }

  return Object.freeze({
    build
  });
}
