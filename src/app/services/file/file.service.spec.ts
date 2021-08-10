import { IMock, Mock } from 'typemoq';
import { Logger } from '../../common/logger';
import { BaseFileService } from './base-file.service';
import { FileService } from './file.service';

describe('FolderService', () => {
    let loggerMock: IMock<Logger>;

    let service: BaseFileService;

    beforeEach(() => {
        loggerMock = Mock.ofType<Logger>();

        service = new FileService(loggerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });
});
