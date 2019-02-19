const fs = require('fs');
const chmod = require('chmod');

module.exports = (options) => {
  const fileName = `${options.targetPath}/runMaven.sh`;

  console.log(`creating script runner: ${fileName}`);

  // example POC values..
  const {perfectoToken} = options;

  const threads = 1,
        browserProfile = "perfecto-chrome",
        env = "websquad1",
        tags = "@Functional and @Marketing_Tribe",
        tribe = "Marketing-tribe",
        hubUrl = "https://ee.perfectomobile.com/nexperience/perfectomobile/wd/hub/fast",
        reportiumJobName = "TESTING_Marketing-Functional",
        reportiumJobNumber = "-123",
        reportiumTags = "Marketing Functional"
        featuresDirectory = "src/test/resources/features",
        outputDirectory = "target/generated-test-sources/cucumbers",
        cucumberOutputDirectory = "target/cucumber-reports"

  // the things we want to put into our shell-script
  const header = "# /usr/share/maven/bin/mvn"
  const mvnCommand = `mvn clean install -X -U -Pparallel -Dthreads="${threads}" -DbrowserProfile=${browserProfile} -Denv=${env} -Dtags="${tags}" -Dtribe="${tribe}" -Dperfecto.securityToken="${perfectoToken}" -DhubUrl="${hubUrl}" -Dreportium-job-name="${reportiumJobName}" -Dreportium-job-number="${reportiumJobNumber}" -Dreportium-tags="${reportiumTags}" -DfeaturesDirectory="${featuresDirectory}" -DoutputDirectory="${outputDirectory}" -DcucumberOutputDir="${cucumberOutputDirectory}"`

  const fileContent = `${header}\n\n${mvnCommand}\n`;

  return new Promise( (resolve, reject) => {
    fs.writeFile(fileName, fileContent, function(err) {
    if(err) {
        reject(err);
    }

    chmod(fileName, 777);

    resolve();
    });
  })

}
