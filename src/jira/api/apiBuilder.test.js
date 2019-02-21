const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');

const axiosStub = require('../../../test/axiosStub');
const expect = require('../../../test/test-hooks').expect;

const apiBuilder = proxyquire('./apiBuilder', {'axios': axiosStub});

describe('apiBuilder(config)', () => {

  beforeEach( () => {
    axiosStub.get.reset();
    axiosStub.post.reset();
  })

  describe('.createTestPlan()', () => {
    it('makes a post request to {config.hostname}/rest/api/2/issue', async() => {
      axiosStub.post.returns(Promise.resolve({data:{}}));

      await apiBuilder({
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "mySummary",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: []
                    }
                  }
                }
              }
            }
          }).createTestPlan();

      expect(axiosStub.post).to.have.been.calledWith(
        'https://127.0.0.1/rest/api/2/issue',
        sinon.match.any,
        sinon.match.any
      );
    });

    it('builds a payload object using config', async() => {
      axiosStub.post.returns(Promise.resolve({data:{}}));

      await apiBuilder({
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "mySummary",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: []
                    }
                  }
                }
              }
            }
          }).createTestPlan();


      const expectedPayload = {
        fields: {
          project: {
            key: "myProjectName"
          },
          summary: "mySummary",
          description: "auto-created test-plan for mySummary",
          issuetype: {
            name: "Test Plan"
          },
          customfield_16546: {
            value: "shop",
            child: {
              value: "squad1"
            }
          },
          components: [
            { name: "web" },
            { name: "aem_somethingorother" },
          ]
        }
      };


      expect(axiosStub.post).to.have.been.calledWith(
        sinon.match.any,
        expectedPayload,
        sinon.match.any
      );
    });

    it('passes {config.username} & {config.password} in the auth block', async() => {
      axiosStub.post.returns(Promise.resolve({data:{}}));

      await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "mySummary",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: []
                    }
                  }
                }
              }
            }
          }).createTestPlan();

      expect(axiosStub.post).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        {auth: {username: "user", password: "pass"}}
      );
    });

    it('resolves response.data.key', async() => {
      axiosStub.post.returns(Promise.resolve({data:{
        key: 'myKey'}
      }));

      const resolution = await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "mySummary",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: []
                    }
                  }
                }
              }
            }
          }).createTestPlan();

      expect(resolution).to.equal('myKey');
    });

  });




  describe('.findTestPlanBySummary()', () => {
    it('makes a get request to {config.hostname}/rest/api/2/search?jql=summary ~ {config.summary} (with the query url-encoded..)', async() => {
      axiosStub.get.returns(Promise.resolve({data:{issues:[]}}));

      await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "the name of my test plan",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: []
                    }
                  }
                }
              }
            }
          }).findTestPlanBySummary();

      expect(axiosStub.get).to.have.been.calledWith(
        'https://127.0.0.1/rest/api/2/search?jql=summary%20~%20%22the%20name%20of%20my%20test%20plan%22',
        sinon.match.any
      );
    });

    it('passes {config.username} & {config.password} in the auth block', async() => {
      axiosStub.get.returns(Promise.resolve({data:{issues:[]}}));

      await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "the name of my test plan",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: []
                    }
                  }
                }
              }
            }
          }).findTestPlanBySummary();

      expect(axiosStub.get).to.have.been.calledWith(
        sinon.match.any,
        {auth: {username: "user", password: "pass"}}
      );
    });

    it('if zero test plans are found, results with null', async() => {
      axiosStub.get.returns(Promise.resolve({data:{issues:[]}}));

      const resolution = await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "the name of my test plan",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: []
                    }
                  }
                }
              }
            }
          }).findTestPlanBySummary();

      expect(resolution).to.equal(null);
    });

    it('if one test plan is found, resolves response.data.issues[0].key', async() => {
      axiosStub.get.returns(Promise.resolve({data:{issues:[
        {key: 'myKey'}
      ]}}));

      const resolution = await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "the name of my test plan",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: []
                    }
                  }
                }
              }
            }
          }).findTestPlanBySummary();

      expect(resolution).to.equal('myKey');
    });

    xit('if multiple test plans are found, rejects', async() => {
      axiosStub.get.returns(Promise.resolve({data:{issues:[
        {key: 'myKey'},
        {key: 'myOtherKey'}
      ]}}));

      const resolution = await apiBuilder({}).findTestPlanBySummary();

      expect(resolution).to.equal('myKey');
    });

  });

  describe('.findTestsByLabels()', () => {
    it('makes a get request to {config.hostname}/rest/api/2/search?jql=labels = {config.labels[0]} AND {optsions.labels[1]} (with the jql query url-encoded)', async() => {
      axiosStub.get.returns(Promise.resolve({data:{issues:[]}}));

      await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "the name of my test plan",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: ["label1","label2","label3"]
                    }
                  }
                }
              }
            }
          }).findTestsByLabels();

      expect(axiosStub.get).to.have.been.calledWith(
        'https://127.0.0.1/rest/api/2/search?jql=labels%20%3D%20label1%20AND%20labels%20%3D%20label2%20AND%20labels%20%3D%20label3',
        sinon.match.any
      );
    });

    it('passes {config.username} & {config.password} in the auth block', async() => {
      axiosStub.get.returns(Promise.resolve({data:{issues:[]}}));

      await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "the name of my test plan",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: ["label1","label2","label3"]
                    }
                  }
                }
              }
            }
          }).findTestsByLabels();

      expect(axiosStub.get).to.have.been.calledWith(
        sinon.match.any,
        {auth: {username: "user", password: "pass"}}
      );
    });

    it('resolves with the list of keys that were returned', async() => {
      axiosStub.get.returns(Promise.resolve({data:{
        issues:[
          {key: 'issue1'},
          {key: 'issue2'}
        ]
      }}));

      const resolution = await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "the name of my test plan",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: ["label1","label2","label3"]
                    }
                  }
                }
              }
            }
          }).findTestsByLabels();

      expect(resolution).to.deep.equal(['issue1', 'issue2']);
    });

  });

  describe('.synchroniseTestPlan(testPlanKey, delta)', () => {
    it('makes a post request to {config.hostname}/rest/raven/1.0/api/testplan/{testPlanKey}/test', async() => {
      axiosStub.post.returns(Promise.resolve({data:{issues:[]}}));

      await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "the name of my test plan",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: ["label1","label2","label3"]
                    }
                  }
                }
              }
            }
          }).synchroniseTestPlan('ABC-123', {added:[],removed:[]});

      expect(axiosStub.post).to.have.been.calledWith(
        'https://127.0.0.1/rest/raven/1.0/api/testplan/ABC-123/test',
        sinon.match.any,
        sinon.match.any
      );
    });

    it('passes {delta.added} & {delta.removed} in the post body', async() => {
      axiosStub.post.returns(Promise.resolve({data:{issues:[]}}));

      await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "the name of my test plan",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: ["label1","label2","label3"]
                    }
                  }
                }
              }
            }
          }).synchroniseTestPlan('ABC-123',{added:['ABC-123','DEF-456'],removed:['XYZ-987']});

      expect(axiosStub.post).to.have.been.calledWith(
        sinon.match.any,
        {add:['ABC-123','DEF-456'],remove:['XYZ-987']},
        sinon.match.any
      );
    });

    it('passes {config.username} & {config.password} in the auth block', async() => {
      axiosStub.post.returns(Promise.resolve({data:{issues:[]}}));

      await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "the name of my test plan",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: ["label1","label2","label3"]
                    }
                  }
                }
              }
            }
          }).synchroniseTestPlan('ABC-123',{added:[],removed:[]});

      expect(axiosStub.post).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        {auth: {username: "user", password: "pass"}}
      );
    });

  });

  describe('.listTestsAgainstATestPlan(testPlanKey)', () => {
    it('makes a get request to {config.hostname}/rest/raven/1.0/api/testplan/{testPlanKey}/test', async() => {
      axiosStub.get.returns(Promise.resolve({data:[]}));

      await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "the name of my test plan",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: ["label1","label2","label3"]
                    }
                  }
                }
              }
            }
          }).listTestsAgainstATestPlan('ABC-123');

      expect(axiosStub.get).to.have.been.calledWith(
        'https://127.0.0.1/rest/raven/1.0/api/testplan/ABC-123/test',
        sinon.match.any
      );
    });

    it('passes {config.username} & {config.password} in the auth block', async() => {
      axiosStub.get.returns(Promise.resolve({data:[]}));

      await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "the name of my test plan",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: ["label1","label2","label3"]
                    }
                  }
                }
              }
            }
          }).listTestsAgainstATestPlan();

      expect(axiosStub.get).to.have.been.calledWith(
        sinon.match.any,
        {auth: {username: "user", password: "pass"}}
      );
    });

    it('resolves with the list of keys that were returned', async() => {
      axiosStub.get.returns(Promise.resolve({data:[
          {key: 'issue1'},
          {key: 'issue2'}
        ]
      }));

      const resolution = await apiBuilder({
        username: "user",
        password: "pass",
        config: {
          tests: {
              xray: {
                  features: {
                    host: "https://127.0.0.1",
                    testplan: {
                      project: "myProjectName",
                      summary: "xxxx",
                      summary: "the name of my test plan",
                      tribe:"shop",
                      squad:"squad1",
                      components:["web","aem_somethingorother"],
                      labels: ["label1","label2","label3"]
                    }
                  }
                }
              }
            }
          }).listTestsAgainstATestPlan();

      expect(resolution).to.deep.equal(['issue1', 'issue2']);
    });

  });

});
