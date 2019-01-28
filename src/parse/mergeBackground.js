module.exports = (elements) => {

  const merged = [];

  let currentScenarioSteps = [];

  elements.forEach( (element) => {
    currentScenarioSteps = currentScenarioSteps.concat(element.steps);
    if (element.type == 'scenario') {
      const mergedElement = {
        name: element.name,
        type: 'scenario',
        steps: currentScenarioSteps
      }

      merged.push(mergedElement);
      currentScenarioSteps = [];
    }
  })

  return merged;
}
