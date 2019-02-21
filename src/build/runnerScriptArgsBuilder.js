module.exports = (args) => {

  let result = '';

  const keys = Object.keys(args);

  for (var i=0; i<keys.length; i++) {
    if (i >0) {
      result = result + ' ';
    }
    result = result + '-D' + keys[i] + '="' + args[keys[i]] + '"'
  }
  
  return result;
}
