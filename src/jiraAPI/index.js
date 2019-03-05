const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const querystring = require("querystring")

const executionPlanPayloadBuilder = require('./executionPlanPayloadBuilder');
const payloadBuilder = require('./payloadBuilder');
const searchQueryBuilder = require('./searchQueryBuilder');


module.exports = (config) => {
  const {hostname, username, password} = config;

  const auth = {auth: {
    "username": username,
    "password": password
  }};

  const createTestPlan = async(testplan) => {
    console.log(`creating test plan "${testplan.summary}"`);

    const url = `${hostname}/rest/api/2/issue`,
          payload = payloadBuilder(testplan),
          response = await axios.post( url, payload, auth );

    return response.data.key;
  }

  const createTestExecution = async(testplan) => {
    console.log(`creating test execution`);

    const url = `${hostname}/rest/api/2/issue`,
          payload = executionPlanPayloadBuilder(testplan),
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

  const findTestPlanBySummary = async(summary) => {
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

  const findTestsByLabels = async(labels = []) => {
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

    return response.data.map( (test) => {return test.key} );
  }

  const triggerExport = async(testPlanKey, temporaryZip) => {
    const url = `${hostname}/rest/raven/1.0/export/test?keys=${testPlanKey}&fz=true`;

    const writer = fs.createWriteStream(temporaryZip);

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      auth: config
    });

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
     writer.on('finish', resolve)
     writer.on('error', reject)
   });
  }

  const importTestExecutionResults = async(locationOfBundledResults) => {
    const form = new FormData();
    form.append('file', fs.createReadStream(locationOfBundledResults));

    const url = `${hostname}/rest/raven/1.0/import/execution/bundle`;

    await axios({
      url,
      method: 'POST',
      auth: auth.auth,
      headers: form.getHeaders(),
      data: form
    });

  };

  return Object.freeze({
    createTestPlan,
    createTestExecution,
    associateTestExecutionWithPlan,
    addTestsToTestExecution,
    findTestPlanBySummary,
    findTestsByLabels,
    synchroniseTestPlan,
    listTestsAgainstATestPlan,
    triggerExport,
    importTestExecutionResults
  })
}
