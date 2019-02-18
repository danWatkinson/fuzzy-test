var querystring = require("querystring")

module.exports = (labels) => {
  let query = '';
  if (labels.length) {
    query = query + 'jql='

    for (var i=0; i<labels.length; i++) {
      if (i != 0) {
        query = query + '%20AND%20'
      }
      query = query + 'labels%20%3D%20'+labels[i]
    }

  }

  return query;
}
