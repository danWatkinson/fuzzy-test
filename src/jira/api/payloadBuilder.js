module.exports = (options) => {

  const namedComponents = options.components ? options.components.map( (component)=> {return {name: component}} ) : [];

  return Object.freeze({
    fields: {
      project: {
        key: options.project
      },
      summary: options.summary,
      description: "auto-created test-plan for " +options.summary,
      issuetype: {
        name: "Test Plan"
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
