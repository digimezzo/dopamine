import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../core/settings/base-settings';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { CollectionComponent } from './collection.component';

describe('CollectionComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let settingsMock: IMock<BaseSettings>;

    let component: CollectionComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        settingsMock = Mock.ofType<BaseSettings>();
        component = new CollectionComponent(appearanceServiceMock.object, settingsMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', async () => {
            // Arrange

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.appearanceService).toBeDefined();
        });
    });

    describe('ngOnInit', () => {
        it('should set the explore tab from the settings', async () => {
            // Arrange
            const settingsStub: any = { selectedTab: 'explore' };
            component = new CollectionComponent(appearanceServiceMock.object, settingsStub);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedIndex).toEqual(0);
        });

        it('should set the songs tab from the settings', async () => {
            // Arrange
            const settingsStub: any = { selectedTab: 'tracks' };
            component = new CollectionComponent(appearanceServiceMock.object, settingsStub);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedIndex).toEqual(1);
        });

        it('should set the playlists tab from the settings', async () => {
            // Arrange
            const settingsStub: any = { selectedTab: 'playlists' };
            component = new CollectionComponent(appearanceServiceMock.object, settingsStub);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedIndex).toEqual(2);
        });

        it('should set the folders tab from the settings', async () => {
            // Arrange
            const settingsStub: any = { selectedTab: 'folders' };
            component = new CollectionComponent(appearanceServiceMock.object, settingsStub);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedIndex).toEqual(3);
        });

        it('should set the explore tab if the settings contain an unknown tab', async () => {
            // Arrange
            const settingsStub: any = { selectedTab: 'unknown' };
            component = new CollectionComponent(appearanceServiceMock.object, settingsStub);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedIndex).toEqual(0);
        });

        it('should set the explore tab if the settings contain an empty tab', async () => {
            // Arrange
            const settingsStub: any = { selectedTab: '' };
            component = new CollectionComponent(appearanceServiceMock.object, settingsStub);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedIndex).toEqual(0);
        });
    });

    describe('selectedIndex', () => {
        it('should save the explore tab to the settings', async () => {
            // Arrange
            const settingsStub: any = { selectedTab: '' };
            component = new CollectionComponent(appearanceServiceMock.object, settingsStub);
            component.selectedIndex = 0;

            // Act
            await component.ngOnInit();

            // Assert
            expect(settingsStub.selectedTab).toEqual('explore');
        });

        it('should save the songs tab to the settings', async () => {
            // Arrange
            const settingsStub: any = { selectedTab: '' };
            component = new CollectionComponent(appearanceServiceMock.object, settingsStub);
            component.selectedIndex = 1;

            // Act
            await component.ngOnInit();

            // Assert
            expect(settingsStub.selectedTab).toEqual('tracks');
        });

        it('should save the playlists tab to the settings', async () => {
            // Arrange
            const settingsStub: any = { selectedTab: '' };
            component = new CollectionComponent(appearanceServiceMock.object, settingsStub);
            component.selectedIndex = 2;

            // Act
            await component.ngOnInit();

            // Assert
            expect(settingsStub.selectedTab).toEqual('playlists');
        });

        it('should save the folders tab to the settings', async () => {
            // Arrange
            const settingsStub: any = { selectedTab: '' };
            component = new CollectionComponent(appearanceServiceMock.object, settingsStub);
            component.selectedIndex = 3;

            // Act
            await component.ngOnInit();

            // Assert
            expect(settingsStub.selectedTab).toEqual('folders');
        });
    });
});
