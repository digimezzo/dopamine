import * as assert from 'assert';
import { SubfolderModel } from './subfolder-model';

describe('SubfolderModel', () => {
    describe('constructor', () => {
        it('should set path', () => {
            // Arrange
            const string1: string = undefined;

            // Act
            const subfolderModel: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);

            // Assert
            assert.strictEqual(subfolderModel.path, '/home/user/Music/subfolder1');
        });

        it('should set isGoToParent', () => {
            // Arrange
            const string1: string = undefined;

            // Act
            const subfolderModel: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', true);

            // Assert
            assert.strictEqual(subfolderModel.isGoToParent, true);
        });
    });
});
