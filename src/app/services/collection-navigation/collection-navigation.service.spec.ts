import { CollectionNavigationService } from './collection-navigation.service';
import { IMock, Mock } from 'typemoq';
import { SettingsBase } from '../../common/settings/settings.base';

describe('CollectionNavigationService', () => {
    let settingsMock: IMock<SettingsBase>;
    const settingsStub: any = { selectedCollectionPage: 0, showArtistsPage: false, showGenresPage: false, showAlbumsPage: false };

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
    });

    function createSut(): CollectionNavigationService {
        return new CollectionNavigationService(settingsMock.object);
    }

    function createSutUsingStub(): CollectionNavigationService {
        return new CollectionNavigationService(settingsStub);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: CollectionNavigationService = createSut();

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('hasVisiblePages', () => {
        it('should return true if any page is visible', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => false);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => false);
            settingsMock.setup((x) => x.showTracksPage).returns(() => false);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => false);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => false);

            // Act
            const service: CollectionNavigationService = createSut();

            // Assert
            expect(service.hasVisiblePages()).toBeTruthy();
        });

        it('should return false if no page is visible', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => false);
            settingsMock.setup((x) => x.showGenresPage).returns(() => false);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => false);
            settingsMock.setup((x) => x.showTracksPage).returns(() => false);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => false);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => false);

            // Act
            const service: CollectionNavigationService = createSut();

            // Assert
            expect(service.hasVisiblePages()).toBeFalsy();
        });
    });

    describe('page', () => {
        it('should set selectedCollectionPage in settings', () => {
            // Arrange
            settingsStub.selectedCollectionPage = 0;
            const service: CollectionNavigationService = createSutUsingStub();

            // Act
            service.page = 1;

            // Assert
            expect(settingsStub.selectedCollectionPage).toEqual(1);
        });

        it('should get page from settings if that page is shown', () => {
            // Arrange
            const service: CollectionNavigationService = createSut();
            settingsMock.setup((x) => x.selectedCollectionPage).returns(() => 2);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);

            // Act, Assert
            expect(service.page).toEqual(2);
        });

        it('should get first shown page if page from settings is not shown and should update settings', () => {
            // Arrange
            const service: CollectionNavigationService = createSutUsingStub();
            settingsStub.selectedCollectionPage = 2;
            settingsStub.showArtistsPage = false;
            settingsStub.showGenresPage = true;
            settingsStub.showAlbumsPage = false;

            // Act, Assert
            expect(service.page).toEqual(1);
            expect(settingsStub.selectedCollectionPage).toEqual(1);
        });
    });
});
