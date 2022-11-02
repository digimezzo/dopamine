import { CollectionTracksTableHeaderComponent } from './collection-tracks-table-header.component';

describe('CollectionTracksTableHeaderComponent', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: CollectionTracksTableHeaderComponent = new CollectionTracksTableHeaderComponent();

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('text', () => {
        it('should set text', () => {
            // Arrange
            const component: CollectionTracksTableHeaderComponent = new CollectionTracksTableHeaderComponent();

            // Act
            component.text = 'the text';

            // Assert
            expect(component.text).toEqual('the text');
        });
    });

    describe('icon', () => {
        it('should set icon', () => {
            // Arrange
            const component: CollectionTracksTableHeaderComponent = new CollectionTracksTableHeaderComponent();

            // Act
            component.icon = 'the icon';

            // Assert
            expect(component.icon).toEqual('the icon');
        });
    });

    describe('isOrderedBy', () => {
        it('should set isOrderedBy', () => {
            // Arrange
            const component: CollectionTracksTableHeaderComponent = new CollectionTracksTableHeaderComponent();

            // Act
            component.isOrderedBy = true;

            // Assert
            expect(component.isOrderedBy).toBeTruthy();
        });
    });

    describe('isOrderedAscending', () => {
        it('should set isOrderedAscending', () => {
            // Arrange
            const component: CollectionTracksTableHeaderComponent = new CollectionTracksTableHeaderComponent();

            // Act
            component.isOrderedAscending = true;

            // Assert
            expect(component.isOrderedAscending).toBeTruthy();
        });
    });
});
