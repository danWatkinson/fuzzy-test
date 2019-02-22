const traverse = require('traverse');

const marker = new RegExp(/^\${(.*)}$/);

module.exports = (config) => {

  function isAString(element) {
    return (typeof element == 'string' || element instanceof String)
  }


  return traverse(config).map(function (element) {
    if (isAString(element) && element.match(marker)) {

      const lookup = element.match(marker)[1];
      const value = config[lookup];

      if (value != undefined) {
        this.update(element.replace(marker, value));
      }
    }
  });

}
