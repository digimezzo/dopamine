import { IMock, Mock, Times } from 'typemoq';
import { Desktop } from './desktop';
import { FileAccess } from './file-access';
import { LogViewer } from './log-viewer';
import { DesktopBase } from './desktop.base';

describe('LogViewer', () => {
    let desktopMock: IMock<DesktopBase>;
    let fileAccessMock: IMock<FileAccess>;

    let logViewer: LogViewer;

    beforeEach(() => {
        desktopMock = Mock.ofType<Desktop>();
        fileAccessMock = Mock.ofType<FileAccess>();

        desktopMock.setup((x) => x.getApplicationDataDirectory()).returns(() => '/home/.config/Dopamine');
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
