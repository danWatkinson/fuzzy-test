const fs = require("fs");
const mergeBackground = require('./mergeBackground');

module.exports = (options) => {

  const scenariosFrom = (feature) => {
    const scenarioResults = [];

    mergeBackground(feature.elements).forEach( (scenario) => {
      const scenarioResult = scenario.steps.map(step => step.result.status)
        .reduce( (accumulator, currentValue) => {
          return accumulator == 'failed' ? 'failed' : currentValue;
        });

      scenarioResults.push({
        name: scenario.name,
        result: scenarioResult
      });
    });

    return scenarioResults;
  }

  const filterResultsFrom = (jsonContent) => {
    const features = [];

    jsonContent.forEach( (feature) => {
      features.push(scenariosFrom(feature));
    });

    return features;
  }

  const parse = (file) => {
    const content = fs.readFileSync(file);
    return filterResultsFrom(JSON.parse(content));
  }

  return Object.freeze({
    parse
  })
}
