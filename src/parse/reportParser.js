const fs = require("fs");
const mergeBackground = require('./mergeBackground');

const filterResultsFrom = (jsonContent) => {
  const features = [];

  jsonContent.forEach( (feature) => {
    const featureResults = [];

    const scenariosWithBackgrounds = mergeBackground(feature.elements);

    scenariosWithBackgrounds.forEach( (scenario) => {
      const stepResults = scenario.steps.map( (step) => {
        return step.result.status;
      })

      const scenarioResult = stepResults.reduce( (accumulator, currentValue) => {
        return accumulator == 'failed' ? 'failed' : currentValue;
      }, "passed");

      const scenarioSummary = {name: scenario.name, result: scenarioResult};
      featureResults.push(scenarioSummary);
    })

    features.push(featureResults);
  })

  return features;
}

module.exports = (options) => {

  const parse = (file) => {
    const content = fs.readFileSync(file);
    const parsedContent =  JSON.parse(content);

    const results = filterResultsFrom(parsedContent);
    return results;
  }

  return Object.freeze({
    parse
  })
}
