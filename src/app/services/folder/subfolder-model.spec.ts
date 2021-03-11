import { SubfolderModel } from './subfolder-model';

describe('SubfolderModel', () => {
    let subfolderModel: SubfolderModel;

    beforeEach(() => {
        subfolderModel = new SubfolderModel('/home/user/Music/subfolder1', true);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(subfolderModel).toBeDefined();
        });

        it('should initialize isPlaying as false', () => {
            // Arrange

            // Act

            // Assert
            expect(subfolderModel.isPlaying).toBeFalsy();
        });

        it('should set path', () => {
            // Arrange

            // Act

            // Assert
            expect(subfolderModel.path).toEqual('/home/user/Music/subfolder1');
        });

        it('should set isGoToParent', () => {
            // Arrange

            // Act

            // Assert
            expect(subfolderModel.isGoToParent).toBeTruthy();
        });
    });
});
