import { Subscription } from 'rxjs';
import { CollectionPersister } from './collection-persister';

describe('CollectionPersister', () => {
    let settingsStub: any;

    let collectionPersister: CollectionPersister;

    beforeEach(() => {
        settingsStub = { selectedCollectionTab: 'albums' };

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
            expect(collectionPersister.selectedTab).toEqual('albums');
        });

        it('should define selectedTabChanged$', () => {
            // Arrange

            // Act

            // Assert
            expect(collectionPersister.selectedTabChanged$).toBeDefined();
        });
    });

    describe('selectedTab', () => {
        it('should return "artists" if the artists tab is selected', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'artists';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act

            // Assert
            expect(collectionPersister.selectedTab).toEqual('artists');
        });

        it('should return "genres" if the genres tab is selected', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'genres';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act

            // Assert
            expect(collectionPersister.selectedTab).toEqual('genres');
        });

        it('should return "albums" if the albums tab is selected', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'albums';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act

            // Assert
            expect(collectionPersister.selectedTab).toEqual('albums');
        });

        it('should return "tracks" if the songs tab is selected', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'tracks';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act

            // Assert
            expect(collectionPersister.selectedTab).toEqual('tracks');
        });

        it('should return "playlists" if the playlists tab is selected', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'playlists';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act

            // Assert
            expect(collectionPersister.selectedTab).toEqual('playlists');
        });

        it('should return "folders" if the folders tab is selected', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'folders';
            collectionPersister = new CollectionPersister(settingsStub);

            // Act

            // Assert
            expect(collectionPersister.selectedTab).toEqual('folders');
        });

        it('should set selected collections tab to "artists" in the settings, set the selected tab to "artists" and notify of a tab change, if "artists" is given', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'albums';
            collectionPersister = new CollectionPersister(settingsStub);

            const subscription: Subscription = new Subscription();
            let selectedTabIsChanged: boolean = false;

            subscription.add(
                collectionPersister.selectedTabChanged$.subscribe(() => {
                    selectedTabIsChanged = true;
                })
            );
        
            // Act
            collectionPersister.selectedTab = 'artists';
        
            // Assert
            expect(settingsStub.selectedCollectionTab).toEqual('artists');
            expect(collectionPersister.selectedTab).toEqual('artists');
            expect(selectedTabIsChanged).toBeTruthy();
        });

        it('should set selected collections tab to "genres" in the settings, set the selected tab to "genres" and notify of a tab change, if "genres" is given', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'albums';
            collectionPersister = new CollectionPersister(settingsStub);

            const subscription: Subscription = new Subscription();
            let selectedTabIsChanged: boolean = false;

            subscription.add(
                collectionPersister.selectedTabChanged$.subscribe(() => {
                    selectedTabIsChanged = true;
                })
            );
        
            // Act
            collectionPersister.selectedTab = 'genres';
        
            // Assert
            expect(settingsStub.selectedCollectionTab).toEqual('genres');
            expect(collectionPersister.selectedTab).toEqual('genres');
            expect(selectedTabIsChanged).toBeTruthy();
        });

        it('should set selected collections tab to "albums" in the settings, set the selected tab to "albums" and notify of a tab change, if "albums" is given', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'folders';
            collectionPersister = new CollectionPersister(settingsStub);

            const subscription: Subscription = new Subscription();
            let selectedTabIsChanged: boolean = false;

            subscription.add(
                collectionPersister.selectedTabChanged$.subscribe(() => {
                    selectedTabIsChanged = true;
                })
            );
        
            // Act
            collectionPersister.selectedTab = 'albums';
        
            // Assert
            expect(settingsStub.selectedCollectionTab).toEqual('albums');
            expect(collectionPersister.selectedTab).toEqual('albums');
            expect(selectedTabIsChanged).toBeTruthy();
        });

        it('should set selected collections tab to "tracks" in the settings, set the selected tab to "tracks" and notify of a tab change, if "tracks" is given', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'albums';
            collectionPersister = new CollectionPersister(settingsStub);

            const subscription: Subscription = new Subscription();
            let selectedTabIsChanged: boolean = false;

            subscription.add(
                collectionPersister.selectedTabChanged$.subscribe(() => {
                    selectedTabIsChanged = true;
                })
            );
        
            // Act
            collectionPersister.selectedTab = 'tracks';
        
            // Assert
            expect(settingsStub.selectedCollectionTab).toEqual('tracks');
            expect(collectionPersister.selectedTab).toEqual('tracks');
            expect(selectedTabIsChanged).toBeTruthy();
        });

        it('should set selected collections tab to "playlists" in the settings, set the selected tab to "playlists" and notify of a tab change, if "playlists" is given', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'albums';
            collectionPersister = new CollectionPersister(settingsStub);

            const subscription: Subscription = new Subscription();
            let selectedTabIsChanged: boolean = false;

            subscription.add(
                collectionPersister.selectedTabChanged$.subscribe(() => {
                    selectedTabIsChanged = true;
                })
            );
        
            // Act
            collectionPersister.selectedTab = 'playlists';
        
            // Assert
            expect(settingsStub.selectedCollectionTab).toEqual('playlists');
            expect(collectionPersister.selectedTab).toEqual('playlists');
            expect(selectedTabIsChanged).toBeTruthy();
        });

        it('should set selected collections tab to "folders" in the settings, set the selected tab to "folders" and notify of a tab change, if "folders" is given', () => {
            // Arrange
            settingsStub.selectedCollectionTab = 'albums';
            collectionPersister = new CollectionPersister(settingsStub);

            const subscription: Subscription = new Subscription();
            let selectedTabIsChanged: boolean = false;

            subscription.add(
                collectionPersister.selectedTabChanged$.subscribe(() => {
                    selectedTabIsChanged = true;
                })
            );
        
            // Act
            collectionPersister.selectedTab = 'folders';
        
            // Assert
            expect(settingsStub.selectedCollectionTab).toEqual('folders');
            expect(collectionPersister.selectedTab).toEqual('folders');
            expect(selectedTabIsChanged).toBeTruthy();
        });
    });
});
