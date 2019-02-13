const hyperdiff = require('hyperdiff');

const createTestPlan = require('./createTestPlan/createTestPlan');
const findTestPlanBySummary = require('./findTestPlanBySummary/search');
const searchTestsByLabel = require('./searchTestsByLabel/search');
const addTestsToTestPlan = require('./addTestsToTestPlan/addTestsToTestPlan');
const listTestsAgainstATestPlan = require('./listTestsAgainstATestPlan/listTestsAgainstATestPlan');
const removeTestsFromTestPlan = require('./removeTestsFromTestPlan/removeTestsFromTestPlan');

module.exports = async (options) => {
  let key = await findTestPlanBySummary(options).execute();

  if (!key) {
    const response = await createTestPlan(options).execute();
    key = response.data.key;
  }

  const tests = await searchTestsByLabel(options).execute();

  const existingTests = await listTestsAgainstATestPlan(options).list(key);

  const delta = hyperdiff(existingTests, tests);

  await addTestsToTestPlan(options).add(key, delta.added);

  await removeTestsFromTestPlan(options).remove(key, delta.removed);

}
