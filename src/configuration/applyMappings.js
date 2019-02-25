const traverse = require('traverse');
const lodash = require('lodash');

const marker = new RegExp( /.*\${([^}]*)}/ ); //[anything]${(any number of characters that arent a close bracket)}

module.exports = (config) => {

  function isAString(element) {
    return (typeof element == 'string' || element instanceof String)
  }

  function substitute(element) {
    const match = element.match(marker);

    if (!match) {
      return element;
    } else {
      const lookup = match[1],
            value = lodash.get(config, lookup, `<unmatched mapping: ${lookup}>`),
            toReplace = '${'+lookup+'}';

      return substitute( element.replace(toReplace, value) );
    }
  }

  return traverse(config).map(function (element) {
    if (isAString(element)) {
      this.update( substitute(element) );
    }
  });

}
