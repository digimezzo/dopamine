import { SimilarArtistComponent } from './similar-artist.component';
import { IMock, Mock } from 'typemoq';
import { SettingsBase } from '../../../../../common/settings/settings.base';

describe('NowPlayingArtistInfoComponent', () => {
    let settingsMock: IMock<SettingsBase>;

    function createComponent(): SimilarArtistComponent {
        return new SimilarArtistComponent(settingsMock.object);
    }

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: SimilarArtistComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should ensure empty similarArtist', () => {
            // Arrange

            // Act
            const component: SimilarArtistComponent = createComponent();

            // Assert
            expect(component.similarArtist).toBeDefined();
            expect(component.similarArtist.name).toEqual('');
            expect(component.similarArtist.url).toEqual('');
            expect(component.similarArtist.imageUrl).toEqual('');
            expect(component.similarArtist.biography).toEqual('');
        });
    });
});
