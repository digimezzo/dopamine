import { PlaylistBrowserComponent } from './playlist-browser.component';

describe('PlaylistBrowserComponent', () => {
    beforeEach(() => {});

    function createComponent(): PlaylistBrowserComponent {
        return new PlaylistBrowserComponent();
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: PlaylistBrowserComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });
    });
});
