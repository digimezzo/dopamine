import { PathValidator } from './path-validator';

describe('PathValidator', () => {
    describe('isParentPath', () => {
        it('should return false if parentPath is undefined', () => {
            // Arrange
            const parentPath: string = undefined;
            const childPath: string = '/home/user/Music/track1.mp3';

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPath: boolean = pathValidator.isParentPath(parentPath, childPath);

            // Assert
            expect(isParentPath).toBeFalsy();
        });

        it('should return false if childPath is undefined', () => {
            // Arrange
            const parentPath: string = '/home/user/Music';
            const childPath: string = undefined;

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPath: boolean = pathValidator.isParentPath(parentPath, childPath);

            // Assert
            expect(isParentPath).toBeFalsy();
        });

        it('should return false if parentPath and childPath are undefined', () => {
            // Arrange
            const parentPath: string = undefined;
            const childPath: string = undefined;

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPath: boolean = pathValidator.isParentPath(parentPath, childPath);

            // Assert
            expect(isParentPath).toBeFalsy();
        });

        it('should return false if parentPath is empty', () => {
            // Arrange
            const parentPath: string = '';
            const childPath: string = '/home/user/Music/track1.mp3';

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPath: boolean = pathValidator.isParentPath(parentPath, childPath);

            // Assert
            expect(isParentPath).toBeFalsy();
        });

        it('should return false if childPath is empty', () => {
            // Arrange
            const parentPath: string = '/home/user/Music';
            const childPath: string = '';

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPath: boolean = pathValidator.isParentPath(parentPath, childPath);

            // Assert
            expect(isParentPath).toBeFalsy();
        });

        it('should return false if parentPath and childPath are empty', () => {
            // Arrange
            const parentPath: string = '';
            const childPath: string = '';

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPath: boolean = pathValidator.isParentPath(parentPath, childPath);

            // Assertsame path as  childPath
            expect(isParentPath).toBeFalsy();
        });

        it('should return false if parentPath is white space', () => {
            // Arrange
            const parentPath: string = ' ';
            const childPath: string = '/home/user/Music/track1.mp3';

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPath: boolean = pathValidator.isParentPath(parentPath, childPath);

            // Assert
            expect(isParentPath).toBeFalsy();
        });

        it('should return false if childPath is white space', () => {
            // Arrange
            const parentPath: string = '/home/user/Music';
            const childPath: string = ' ';

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPath: boolean = pathValidator.isParentPath(parentPath, childPath);

            // Assert
            expect(isParentPath).toBeFalsy();
        });

        it('should return false if parentPath and childPath are white space', () => {
            // Arrange
            const parentPath: string = ' ';
            const childPath: string = ' ';

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPath: boolean = pathValidator.isParentPath(parentPath, childPath);

            // Assert
            expect(isParentPath).toBeFalsy();
        });

        it('should return true if parentPath is a parent path of childPath', () => {
            // Arrange
            const parentPathForLinux: string = '/home/user/Music/Subfolder1';
            const childPathForLinux: string = '/home/user/Music/Subfolder1/track1.mp3';
            const parentPathForWindows: string = 'C:\\Users\\user\\Music\\Subfolder1';
            const childPathForWindows: string = 'C:\\Users\\user\\Music\\Subfolder1\\track1.mp3';

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPathForLinux: boolean = pathValidator.isParentPath(parentPathForLinux, childPathForLinux);
            const isParentPathForWindows: boolean = pathValidator.isParentPath(parentPathForWindows, childPathForWindows);

            // Assert
            expect(isParentPathForLinux).toBeTruthy();
            expect(isParentPathForWindows).toBeTruthy();
        });

        it('should return true if parentPath is the same path as  childPath', () => {
            // Arrange
            const parentPathForLinux: string = '/home/user/Music/Subfolder1';
            const childPathForLinux: string = '/home/user/Music/Subfolder1';
            const parentPathForWindows: string = 'C:\\Users\\user\\Music\\Subfolder1';
            const childPathForWindows: string = 'C:\\Users\\user\\Music\\Subfolder1';

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPathForLinux: boolean = pathValidator.isParentPath(parentPathForLinux, childPathForLinux);
            const isParentPathForWindows: boolean = pathValidator.isParentPath(parentPathForWindows, childPathForWindows);

            // Assert
            expect(isParentPathForLinux).toBeTruthy();
            expect(isParentPathForWindows).toBeTruthy();
        });

        it('should return true if parentPath is the parent folder of file with path is childPath', () => {
            // Arrange
            const parentPathForLinux: string = '/home/user/Music/Subfolder1';
            const childPathForLinux: string = '/home/user/Music/Subfolder1/track1.mp3';
            const parentPathForWindows: string = 'C:\\Users\\user\\Music\\Subfolder1';
            const childPathForWindows: string = 'C:\\Users\\user\\Music\\Subfolder1\\track1.mp3';

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPathForLinux: boolean = pathValidator.isParentPath(parentPathForLinux, childPathForLinux);
            const isParentPathForWindows: boolean = pathValidator.isParentPath(parentPathForWindows, childPathForWindows);

            // Assert
            expect(isParentPathForLinux).toBeTruthy();
            expect(isParentPathForWindows).toBeTruthy();
        });

        it('should return false if parentPath is not a parent path of childPath', () => {
            // Arrange
            const parentPathForLinux: string = '/home/user/Downloads';
            const childPathForLinux: string = '/home/user/Music/track1.mp3';
            const parentPathForWindows: string = 'C:\\Users\\user\\Downloads';
            const childPathForWindows: string = 'C:\\Users\\user\\Music\\track1.mp3';

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPathForLinux: boolean = pathValidator.isParentPath(parentPathForLinux, childPathForLinux);
            const isParentPathForWindows: boolean = pathValidator.isParentPath(parentPathForWindows, childPathForWindows);

            // Assert
            expect(isParentPathForLinux).toBeFalsy();
            expect(isParentPathForWindows).toBeFalsy();
        });

        it('should return false if parentPath is included in childPath but it is not a parent path', () => {
            // Arrange
            const parentPathForLinux: string = '/home/user/Music/Subfolder1';
            const childPathForLinux: string = '/home/user/Music/Subfolder1 almost the same/track1.mp3';
            const parentPathForWindows: string = 'C:\\Users\\user\\Music\\Subfolder1';
            const childPathForWindows: string = 'C:\\Users\\user\\Music\\Subfolder1 almost the same\\track1.mp3';

            const pathValidator: PathValidator = new PathValidator();

            // Act
            const isParentPathForLinux: boolean = pathValidator.isParentPath(parentPathForLinux, childPathForLinux);
            const isParentPathForWindows: boolean = pathValidator.isParentPath(parentPathForWindows, childPathForWindows);

            // Assert
            expect(isParentPathForLinux).toBeFalsy();
            expect(isParentPathForWindows).toBeFalsy();
        });
    });
});
