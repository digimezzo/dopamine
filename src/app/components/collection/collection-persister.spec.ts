import { CollectionPersister } from './collection-persister';

describe('CollectionPersister', () => {
    let settingsStub: any;

    let collectionPersister: CollectionPersister;

    beforeEach(() => {
        settingsStub = { selectedCollectionTab: 'folders' };

        collectionPersister = new CollectionPersister(settingsStub);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(collectionPersister).toBeDefined();
        });

        it('should initialize the selected tab from the settings', () => {
            // Arrange

            // Act

            // Assert
            expect(collectionPersister.getSelectedTabIndex()).toEqual(5);
        });
    });

    describe('getSelectedTabIndex', () => {
        it('should return 0 if the artists tab is selected', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'artists';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act

            // Assert
            expect(collectionPersister.getSelectedTabIndex()).toEqual(0);
        });

        it('should return 1 if the artists tab is selected', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'genres';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act

            // Assert
            expect(collectionPersister.getSelectedTabIndex()).toEqual(1);
        });

        it('should return 2 if the artists tab is selected', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'albums';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act

            // Assert
            expect(collectionPersister.getSelectedTabIndex()).toEqual(2);
        });

        it('should return 3 if the artists tab is selected', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'tracks';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act

            // Assert
            expect(collectionPersister.getSelectedTabIndex()).toEqual(3);
        });

        it('should return 4 if the artists tab is selected', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'playlists';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act

            // Assert
            expect(collectionPersister.getSelectedTabIndex()).toEqual(4);
        });

        it('should return 5 if the artists tab is selected', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'folders';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act

            // Assert
            expect(collectionPersister.getSelectedTabIndex()).toEqual(5);
        });
    });

    describe('setSelectedTabFromTabIndex', () => {
        it('should set selected collections tab to "artists" in the settings and set selected tab index to 0 if 0 is given', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'albums';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act
            collectionPersister.setSelectedTabFromTabIndex(0);

            // Assert
            expect(settingsStub.selectedCollectionTab).toEqual('artists');
            expect(collectionPersister.getSelectedTabIndex()).toEqual(0);
        });

        it('should set selected collections tab to "genres" in the settings and set selected tab index to 1 if 1 is given', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'albums';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act
            collectionPersister.setSelectedTabFromTabIndex(1);

            // Assert
            expect(settingsStub.selectedCollectionTab).toEqual('genres');
            expect(collectionPersister.getSelectedTabIndex()).toEqual(1);
        });

        it('should set selected collections tab to "albums" in the settings and set selected tab index to 2 if 2 is given', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'folders';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act
            collectionPersister.setSelectedTabFromTabIndex(2);

            // Assert
            expect(settingsStub.selectedCollectionTab).toEqual('albums');
            expect(collectionPersister.getSelectedTabIndex()).toEqual(2);
        });

        it('should set selected collections tab to "tracks" in the settings and set selected tab index to 3 if 3 is given', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'albums';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act
            collectionPersister.setSelectedTabFromTabIndex(3);

            // Assert
            expect(settingsStub.selectedCollectionTab).toEqual('tracks');
            expect(collectionPersister.getSelectedTabIndex()).toEqual(3);
        });

        it('should set selected collections tab to "playlists" in the settings and set selected tab index to 4 if 4 is given', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'albums';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act
            collectionPersister.setSelectedTabFromTabIndex(4);

            // Assert
            expect(settingsStub.selectedCollectionTab).toEqual('playlists');
            expect(collectionPersister.getSelectedTabIndex()).toEqual(4);
        });

        it('should set selected collections tab to "folders" in the settings and set selected tab index to 5 if 5 is given', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'albums';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act
            collectionPersister.setSelectedTabFromTabIndex(5);

            // Assert
            expect(settingsStub.selectedCollectionTab).toEqual('folders');
            expect(collectionPersister.getSelectedTabIndex()).toEqual(5);
        });
    });
});
