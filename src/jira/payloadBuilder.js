module.exports = (options) => {

  const { squad, components } = options;

  const squadTribe = squad?squad.split(':')[0]:''
  const squadName = squad?squad.split(':')[1]:''

  const componentElements = components
                              ? components.split(',').map( (component) => {return {name: component} } )
                              : [];

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
        value: squadTribe,
        child: {
          value: squadName
        }
      },
      components: componentElements
    }
  });
}
