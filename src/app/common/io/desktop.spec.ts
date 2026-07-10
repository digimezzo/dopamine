import * as remote from '@electron/remote';
import { Desktop } from './desktop';

describe('Desktop', () => {
    let shellMock: { showItemInFolder: jest.Mock; openPath: jest.Mock };

    const originalPlatformDescriptor = Object.getOwnPropertyDescriptor(process, 'platform');
    const originalSnap = process.env.SNAP;
    const originalHome = process.env.HOME;

    function createDesktop(): Desktop {
        return Object.create(Desktop.prototype) as Desktop;
    }

    function setPlatform(platform: NodeJS.Platform): void {
        Object.defineProperty(process, 'platform', {
            value: platform,
            configurable: true,
        });
    }

    beforeEach(() => {
        shellMock = {
            showItemInFolder: jest.fn(),
            openPath: jest.fn().mockResolvedValue(''),
        };

        (remote as unknown as { shell: typeof shellMock }).shell = shellMock;

        process.env.HOME = '/home/me';
        setPlatform('linux');
        delete process.env.SNAP;
    });

    afterEach(() => {
        jest.restoreAllMocks();

        if (originalPlatformDescriptor != undefined) {
            Object.defineProperty(process, 'platform', originalPlatformDescriptor);
        }

        if (originalSnap == undefined) {
            delete process.env.SNAP;
        } else {
            process.env.SNAP = originalSnap;
        }

        if (originalHome == undefined) {
            delete process.env.HOME;
        } else {
            process.env.HOME = originalHome;
        }

        delete (remote as unknown as { shell?: typeof shellMock }).shell;
    });

    describe('showFileInDirectory', () => {
        it('should show the item in its folder outside Snap', () => {
            // Arrange
            const desktop = createDesktop();

            // Act
            desktop.showFileInDirectory('/music/track.mp3');

            // Assert
            expect(shellMock.showItemInFolder).toHaveBeenCalledWith('/music/track.mp3');
            expect(shellMock.openPath).not.toHaveBeenCalled();
        });

        it('should open the containing folder for Snap files outside the home directory', () => {
            // Arrange
            process.env.SNAP = '/snap/dopamine/current';
            const desktop = createDesktop();

            // Act
            desktop.showFileInDirectory('/media/data/music/track.mp3');

            // Assert
            expect(shellMock.openPath).toHaveBeenCalledWith('/media/data/music');
            expect(shellMock.showItemInFolder).not.toHaveBeenCalled();
        });

        it('should show the item in its folder for Snap files inside the home directory', () => {
            // Arrange
            process.env.SNAP = '/snap/dopamine/current';
            const desktop = createDesktop();

            // Act
            desktop.showFileInDirectory('/home/me/Music/track.mp3');

            // Assert
            expect(shellMock.showItemInFolder).toHaveBeenCalledWith('/home/me/Music/track.mp3');
            expect(shellMock.openPath).not.toHaveBeenCalled();
        });

        it('should open the mount point when the file is directly inside it', () => {
            // Arrange
            process.env.SNAP = '/snap/dopamine/current';
            const desktop = createDesktop();

            // Act
            desktop.showFileInDirectory('/media/data/track.mp3');

            // Assert
            expect(shellMock.openPath).toHaveBeenCalledWith('/media/data');
            expect(shellMock.showItemInFolder).not.toHaveBeenCalled();
        });

        it('should ignore rejected openPath promises', async () => {
            // Arrange
            process.env.SNAP = '/snap/dopamine/current';
            shellMock.openPath.mockRejectedValue(new Error('Portal failed'));
            const desktop = createDesktop();

            // Act
            expect(() => desktop.showFileInDirectory('/media/data/music/track.mp3')).not.toThrow();
            await Promise.resolve();

            // Assert
            expect(shellMock.openPath).toHaveBeenCalledWith('/media/data/music');
            expect(shellMock.showItemInFolder).not.toHaveBeenCalled();
        });
    });
});
