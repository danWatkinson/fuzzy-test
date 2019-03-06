const mock = require('mock-fs');
const expect = require('../../../../test/test-hooks').expect;

const fileProvider = require('./fileProvider');

describe('fileProvider(options)', () => {

  afterEach( () => {
    mock.restore();
  })

  describe('.list()', () => {

    it('lists fully qualified filenames found in options.reportDirectory', () => {
      mock({
        'someFolder/file1.json': '',
        'someFolder/file2.json': '',
        'someFolder/file3.json': ''
      });

      const files = fileProvider({reportDirectory: 'someFolder/'}).list();

      expect(files).to.be.equalTo([
        'someFolder/file1.json',
        'someFolder/file2.json',
        'someFolder/file3.json'
      ]);
    })

    it('filters out non .json files', () => {

      mock({
        'someFolder/file1.json': '',
        'someFolder/file2.blah': '',
        'someFolder/file3.json': ''
      });

      const files = fileProvider({reportDirectory: 'someFolder/'}).list();

      expect(files).to.be.equalTo([
        'someFolder/file1.json',
        'someFolder/file3.json'
      ]);
    });

  });
});
