const timestamp = require('time-stamp');

module.exports = (options) => {

  const namedComponents = options.components ? options.components.map( (component)=> {return {name: component}} ) : [];

  return Object.freeze({
    fields: {
      project: {
        key: options.project
      },
      summary: `${options.summary} : ${timestamp('YYYY/MM/DD HH:mm:ss:ms')}`,
      description: "auto-created test-execution for " +options.summary,
      issuetype: {
        name: "Test Execution"
      },
      customfield_16546: {
        value: options.tribe,
        child: {
          value: options.squad
        }
      },
      components: namedComponents
    }
  });
}
