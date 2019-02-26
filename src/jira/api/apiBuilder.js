const axios = require('axios');
const querystring = require("querystring")

const searchQueryBuilder = require('./searchQueryBuilder');

const payloadBuilder = require('./payloadBuilder');
const executionPlanPayloadBuilder = require('./executionPlanPayloadBuilder');


module.exports = (config) => {
  const {hostname, username, password} = config;
  const {summary, labels} = config.testplan;

  const auth = {auth: {
    "username": username,
    "password": password
  }};

  const createTestPlan = async() => {
    console.log(`creating test plan "${summary}"`);

    const url = `${hostname}/rest/api/2/issue`,
          payload = payloadBuilder(config.testplan),
          response = await axios.post( url, payload, auth );

    return response.data.key;
  }

  const createTestExecution = async() => {
    console.log(`creating test execution`);

    const url = `${hostname}/rest/api/2/issue`,
          payload = executionPlanPayloadBuilder(config.testplan),
          response = await axios.post( url, payload, auth );

    return response.data.key;
  }

  const associateTestExecutionWithPlan = async(executionKey, planKey) => {
    console.log(`associating test execution ${executionKey} with test plan ${planKey}`);

    await axios.post(
      `${hostname}/rest/raven/1.0/api/testplan/${planKey}/testexecution`,
      { add: [executionKey] },
      auth
    );
  }

  const addTestsToTestExecution = async(executionKey, listOfTests) => {
    console.log(`adding tests to ${executionKey} : ${listOfTests}`);

    await axios.post(
      `${hostname}/rest/raven/1.0/api/testexec/${executionKey}/test`,
      { add: listOfTests },
      auth
    );
  }

  const findTestPlanBySummary = async() => {
    console.log(`looking for test plan "${summary}"`);

    const query = querystring.stringify({jql: 'summary ~ "' + summary +'" and issueType = "Test Plan"'}),
          url = `${hostname}/rest/api/2/search?${query}`,
          response = await axios.get( url, auth );

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
          response = await axios.get( url, auth);

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
    createTestExecution,
    associateTestExecutionWithPlan,
    addTestsToTestExecution,
    findTestPlanBySummary,
    findTestsByLabels,
    synchroniseTestPlan,
    listTestsAgainstATestPlan,
  })
}
