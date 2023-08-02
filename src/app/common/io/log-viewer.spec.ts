import { IMock, Mock, Times } from 'typemoq';
import { BaseDesktop } from './base-desktop';
import { Desktop } from './desktop';
import { FileAccess } from './file-access';
import { LogViewer } from './log-viewer';

describe('LogViewer', () => {
    let desktopMock: IMock<BaseDesktop>;
    let fileAccessMock: IMock<FileAccess>;

    let logViewer: LogViewer;

    beforeEach(() => {
        desktopMock = Mock.ofType<Desktop>();
        fileAccessMock = Mock.ofType<FileAccess>();

        fileAccessMock.setup((x) => x.applicationDataDirectory()).returns(() => '/home/.config/Dopamine');
        fileAccessMock
            .setup((x) => x.combinePath(['/home/.config/Dopamine', 'logs', 'Dopamine.log']))
            .returns(() => '/home/.config/Dopamine/logs/Dopamine.log');

        logViewer = new LogViewer(desktopMock.object, fileAccessMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(logViewer).toBeDefined();
        });
    });

    describe('viewLog', () => {
        it('should open the log file', () => {
            // Arrange
            const logFilePath: string = '/home/.config/Dopamine/logs/Dopamine.log';

            // Act
            logViewer.viewLog();

            // Assert
            desktopMock.verify((x) => x.showFileInDirectory(logFilePath), Times.once());
        });
    });
});
