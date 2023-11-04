import { IMock, Mock } from 'typemoq';
import { BaseFileService } from '../file/base-file.service';
import { DragAndDropService } from './drag-and-drop.service';
import { BaseDragAndDropService } from './base-drag-and-drop.service';

describe('DragAndDropService', () => {
    let fileServiceMock: IMock<BaseFileService>;

    function createService(): BaseDragAndDropService {
        return new DragAndDropService(fileServiceMock.object);
    }

    beforeEach(() => {
        fileServiceMock = Mock.ofType<BaseFileService>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const sut: BaseDragAndDropService = createService();

            // Assert
            expect(sut).toBeDefined();
        });
    });
});
