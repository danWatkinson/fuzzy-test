const mock = require('mock-fs');
const fs = require('fs');

const expect = require('../../../../../test/test-hooks').expect;

const prependTestExecutionIdToAllFeatures = require('./prependTestExecutionIdToAllFeatures');

describe('prependTestExecutionIdToAllFeatures(locationOfAllFeatures, executionId)', () => {
    describe('puts "@${executionId}" as the first line of every feature file under ${locationOfAllFeatures}', () => {
      it('for a single feature file', () => {

        mock({
          '/location/of/features/file1.feature': 'blah blah blah my feature file'
        });

        prependTestExecutionIdToAllFeatures('/location/of/features', 'EXE-123');

        expect(
          fs.readFileSync('/location/of/features/file1.feature', 'utf-8')
        ).to.startsWith(`@EXE-123\n`);

      });

      it('for many feature files', () => {

        mock({
          '/location/of/features/file1.feature': 'blah blah blah my feature file',
          '/location/of/features/file2.feature': 'blah blah more feature',
          '/location/of/features/file3.feature': 'blah feature feature feature'
        });

        prependTestExecutionIdToAllFeatures('/location/of/features', 'EXE-123');

        expect(
          fs.readFileSync('/location/of/features/file1.feature', 'utf-8')
        ).to.startsWith(`@EXE-123\n`);

        expect(
          fs.readFileSync('/location/of/features/file2.feature', 'utf-8')
        ).to.startsWith(`@EXE-123\n`);

        expect(
          fs.readFileSync('/location/of/features/file3.feature', 'utf-8')
        ).to.startsWith(`@EXE-123\n`);

      });

      it('but not for things that arent feature files..', () => {

        mock({
          '/location/of/features/file1.txt': 'blah blah blah my feature file'
        });

        prependTestExecutionIdToAllFeatures('/location/of/features', 'EXE-123');

        expect(
          fs.readFileSync('/location/of/features/file1.txt', 'utf-8')
        ).to.startsWith('blah blah blah my feature file');

      });

    })
});
