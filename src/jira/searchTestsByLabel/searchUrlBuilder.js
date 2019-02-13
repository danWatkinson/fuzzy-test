module.exports = (options) => {

  const { hostname } = options;
  const labels = options.labels ? options.labels.split(',') : [];

  const build = () => {

    let url = hostname + '/rest/api/2/search';

    if (labels.length) {
      url = url + '?jql='

      for (var i=0; i<labels.length; i++) {
        if (i != 0) {
          url = url + '%20AND%20'
        }
        url = url + 'labels%20%3D%20'+labels[i]
      }

    }

    return url;
  }

  return Object.freeze({
    build
  });
}
