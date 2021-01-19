import * as assert from 'assert';
import { SubfolderModel } from './subfolder-model';

describe('SubfolderModel', () => {
    let subfolderModel: SubfolderModel;

    beforeEach(() => {
        subfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(subfolderModel);
        });

        it('should set path', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(subfolderModel.path, '/home/user/Music/subfolder1');
        });

        it('should set isGoToParent', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(subfolderModel.isGoToParent, true);
        });
    });
});
