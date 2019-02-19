const axios = require('axios');
const querystring = require("querystring")

const searchQueryBuilder = require('./searchQueryBuilder');

const payloadBuilder = require('./payloadBuilder');

module.exports = (options) => {
  const {hostname, summary, squad, components } = options;

  const labels = options.labels ? options.labels.split(',') : [];
  const squadTribe = squad?squad.split(':')[0]:''
  const squadName = squad?squad.split(':')[1]:''
  const componentElements = components ? components.split(',').map((component) => {return {name: component}}) : [];

  const auth = {auth: options}

  const createTestPlan = async() => {
    console.log(`creating test plan "${summary}"`);

    const url = `${hostname}/rest/api/2/issue`,
          payload = payloadBuilder(options),
          response = await axios.post( url, payload, auth );

    return response.data.key;
  }

  const findTestPlanBySummary = async() => {
    console.log(`looking for test plan "${summary}"`);

    const query = querystring.stringify({jql: 'summary ~ "' + summary +'"'}),
          url = `${hostname}/rest/api/2/search?${query}`,
          response = await axios.get( url, {auth: options} );

    if (response.data.issues.length > 1) {
      throw ('found multiple test-plans matching ' + summary);
    } else {
      return response.data.issues[0] ? response.data.issues[0].key : null;
    }
  }

  const findTestsByLabels = async() => {
    console.log(`looking tests labeled ${labels}`);

    const query = searchQueryBuilder(labels),
          url = `${hostname}/rest/api/2/search?${query}`,
          response = await axios.get( url, {auth: options});

    return response.data.issues.map( (issue) => {return issue.key} );
  }

  const synchroniseTestPlan = async(testPlanKey, delta) => {
    console.log(`synching test plan ${testPlanKey}, adding ${delta.added}, removing ${delta.removed}`);

    await axios.post(
      `${hostname}/rest/raven/1.0/api/testplan/${testPlanKey}/test`,
      { add: delta.added, remove: delta.removed },
      auth
    );
  }

  const listTestsAgainstATestPlan = async(testPlanKey) => {
    console.log(`retrieving tests against test plan ${testPlanKey}`);

    const response = await axios.get(
      `${hostname}/rest/raven/1.0/api/testplan/${testPlanKey}/test`,
      auth
    );

    return response.data.map( (test) => {return test.key} )
  }

  return Object.freeze({
    createTestPlan,
    findTestPlanBySummary,
    findTestsByLabels,
    synchroniseTestPlan,
    listTestsAgainstATestPlan,
  })
}
