import { IMock, Mock } from 'typemoq';
import { ListItemStyler } from '../../../../common/styling/list-item-styler';
import { AlbumComponent } from './album.component';

describe('AlbumComponent', () => {
    let listItemStylerMock: IMock<ListItemStyler>;
    let component: AlbumComponent;

    beforeEach(() => {
        listItemStylerMock = Mock.ofType<ListItemStyler>();
        component = new AlbumComponent(listItemStylerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should declare but not define Album', () => {
            // Arrange

            // Act

            // Assert
            expect(component.album).toBeUndefined();
        });

        it('should define listItemStyler', () => {
            // Arrange

            // Act

            // Assert
            expect(component.listItemStyler).toBeDefined();
        });

        it('should define isSelected as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.isSelected).toBeFalsy();
        });
    });
});
