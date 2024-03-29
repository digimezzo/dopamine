import { IMock, It, Mock } from 'typemoq';
import { SubfoldersFilterPipe } from './subfolders-filter.pipe';
import { SubfolderModel } from '../../services/folder/subfolder-model';
import { SearchServiceBase } from '../../services/search/search.service.base';

describe('SubfoldersFilterPipe', () => {
    let searchServiceMock: IMock<SearchServiceBase>;

    function createPipe(): SubfoldersFilterPipe {
        return new SubfoldersFilterPipe(searchServiceMock.object);
    }

    function createSubfolders(): SubfolderModel[] {
        const subfolder1: SubfolderModel = new SubfolderModel('subfolder1', false);
        const subfolder2: SubfolderModel = new SubfolderModel('subfolder2', false);

        return [subfolder1, subfolder2];
    }

    beforeEach(() => {
        searchServiceMock = Mock.ofType<SearchServiceBase>();
    });

    describe('transform', () => {
        it('should return the given subfolders if textToContain is undefined', () => {
            // Arrange
            const subfolders: SubfolderModel[] = createSubfolders();
            const pipe: SubfoldersFilterPipe = createPipe();

            // Act
            const filteredSubfolders: SubfolderModel[] = pipe.transform(subfolders, undefined);

            // Assert
            expect(filteredSubfolders).toEqual(subfolders);
        });

        it('should return the given subfolders if textToContain is empty', () => {
            // Arrange
            const subfolders: SubfolderModel[] = createSubfolders();
            const pipe: SubfoldersFilterPipe = createPipe();

            // Act
            const filteredSubfolders: SubfolderModel[] = pipe.transform(subfolders, '');

            // Assert
            expect(filteredSubfolders).toEqual(subfolders);
        });

        it('should return the given subfolders if textToContain is space', () => {
            // Arrange
            const subfolders: SubfolderModel[] = createSubfolders();
            const pipe: SubfoldersFilterPipe = createPipe();

            // Act
            const filteredSubfolders: SubfolderModel[] = pipe.transform(subfolders, ' ');

            // Assert
            expect(filteredSubfolders).toEqual(subfolders);
        });

        it('should return only artists with a path containing the search text', () => {
            // Arrange

            const subfolders: SubfolderModel[] = createSubfolders();
            searchServiceMock.setup((x) => x.matchesSearchText('subfolder1', It.isAny())).returns(() => true);
            searchServiceMock.setup((x) => x.matchesSearchText('subfolder2', It.isAny())).returns(() => false);
            const pipe: SubfoldersFilterPipe = createPipe();

            // Act
            const filteredSubfolders: SubfolderModel[] = pipe.transform(subfolders, 'dummy');

            // Assert
            expect(filteredSubfolders.length).toEqual(1);
            expect(filteredSubfolders[0]).toEqual(subfolders[0]);
        });

        it('should return no artists if none of their paths contain the search text', () => {
            // Arrange

            const subfolders: SubfolderModel[] = createSubfolders();
            searchServiceMock.setup((x) => x.matchesSearchText('subfolder1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('subfolder2', It.isAny())).returns(() => false);
            const pipe: SubfoldersFilterPipe = createPipe();

            // Act
            const filteredSubfolders: SubfolderModel[] = pipe.transform(subfolders, 'dummy');

            // Assert
            expect(filteredSubfolders.length).toEqual(0);
        });
    });
});
