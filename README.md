# fuzzy-test
POC - parses cucumber json reports, and allows thresholded passing/failing of test suites.

Interacts with Jira / XRay to keep test plans synchronised


```bash
git clone https://github.com/danWatkinson/fuzzy-test.git

cd fuzzy-test

npm install -g

```

## Example of parsing cucumber output

This parses a directory of test files that are in the repo.
It uses the verbose flag so you can see some output to confirm it is actually parsing some files...

```bash
fuzzy-test -t 0.5 -r ./resources/testoutput/manyTests -v
```

## Example of syncing Jira:

You will need to give this a username/password for the provided Jira instance instead of the dummied-out username/password.

This example goes to EE's test Jira instance, finds or creates a test plan called "automated_test_plan_1", then makes sure that this test plan contains all tests tagged with "Marketing_Tribe" and "Functional", and no other tests...

```bash
synchroniseTestPlan -n XTP -s "automated_test_plan_1" -q "Shop:Squad 1" -c Web -u <Jira username> -p <Jira password> -h https://jira-dev.intdigital.ee.co.uk -l "Marketing_Tribe,Functional"
```
