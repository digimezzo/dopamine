import { IMock, Mock } from 'typemoq';
import { ArtistModel } from './artist-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { ApplicationPaths } from '../../common/application/application-paths';
import { Constants } from '../../common/application/constants';
import { ArtistArtworkCacheId } from '../artist-artwork-cache/artist-artwork-cache-id';
import { SemanticZoomableModel } from '../../common/semantic-zoomable-model';

describe('ArtistModel', () => {
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let applicationPathsMock: IMock<ApplicationPaths>;
    let artistModel: ArtistModel;

    function createArtistModel(name: string, ignoredPrefixes: string[] = []): ArtistModel {
        return new ArtistModel(name, 'artist-artworkId', translatorServiceMock.object, applicationPathsMock.object, ignoredPrefixes);
    }

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        translatorServiceMock.setup((x) => x.get('unknown-artist')).returns(() => 'Unknown artist');
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
        artistModel = createArtistModel('My artist');
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel).toBeDefined();
        });

        it('should define isSelected', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.isSelected).toBeDefined();
        });

        it('should define isZoomHeader as false', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.isZoomHeader).toBeFalsy();
        });

        it('should define name', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.displayName).toBeDefined();
        });

        it('should define sortableName', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.sortableName).toBeDefined();
        });

        it('should define header', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.zoomHeader).toBeDefined();
        });
    });

    describe('name', () => {
        it('should return "Unknown artist" if artist is empty', () => {
            // Arrange
            const artist: string = '';
            artistModel = createArtistModel(artist);

            // Act
            const name: string = artistModel.displayName;

            // Assert
            expect(name).toEqual('Unknown artist');
        });

        it('should return "Unknown artist" if artist is space', () => {
            // Arrange
            const artist: string = ' ';
            artistModel = createArtistModel(artist);

            // Act
            const name: string = artistModel.displayName;

            // Assert
            expect(name).toEqual('Unknown artist');
        });

        it('should return the artist name if artist is not undefined, empty or space.', () => {
            // Arrange
            const artist: string = 'My artist';
            artistModel = createArtistModel(artist);

            // Act
            const name: string = artistModel.displayName;

            // Assert
            expect(name).toEqual('My artist');
        });
    });

    describe('ignored prefixes', () => {
        it('should preserve current sorting when no prefixes are configured', () => {
            artistModel = createArtistModel('The Beatles');
            expect(artistModel.sortableName).toEqual('the beatles');
            expect(artistModel.zoomHeader).toEqual('t');
        });

        it('should skip a configured prefix for sorting and grouping without changing the name', () => {
            artistModel = createArtistModel('tHe Beatles', ['The', 'A']);
            expect(artistModel.sortableName).toEqual('beatles');
            expect(artistModel.zoomHeader).toEqual('b');
            expect(artistModel.name).toEqual('tHe Beatles');
            expect(artistModel.displayName).toEqual('tHe Beatles');
        });

        it('should trim the name before matching prefixes as the original sorting did', () => {
            artistModel = createArtistModel('  The Beatles  ', ['The']);
            expect(artistModel.sortableName).toEqual('beatles');
            expect(artistModel.zoomHeader).toEqual('b');
            expect(artistModel.displayName).toEqual('  The Beatles  ');
        });

        it('should preserve prefix-free sorting in generated alphabetical headers', () => {
            artistModel = createArtistModel('The Damning Well', ['The']);
            const header = new SemanticZoomableModel(artistModel);
            expect(header.isZoomHeader).toBe(true);
            expect(header.sortableName).toEqual('damning well');
            expect(header.zoomHeader).toEqual('d');
            expect(header.displayName).toEqual('The Damning Well');
        });

        it.each(['Therapy?', 'A-ha', 'The', 'The   '])('should preserve the name %s', (name) => {
            artistModel = createArtistModel(name, ['The', 'A']);
            expect(artistModel.sortableName).toEqual(createArtistModel(name).sortableName);
        });

        it('should match custom prefixes literally and prefer the longest matching prefix', () => {
            artistModel = createArtistModel('The Amazing Band', ['The', ' The Amazing ', '']);
            expect(artistModel.sortableName).toEqual('band');
            artistModel = createArtistModel('A. Band', ['A.']);
            expect(artistModel.zoomHeader).toEqual('b');
        });

        it('should skip only one prefix and accept whitespace between words', () => {
            artistModel = createArtistModel('The\tThe Band', ['The']);
            expect(artistModel.sortableName).toEqual('the band');
        });

        it('should preserve unknown artist grouping', () => {
            artistModel = createArtistModel('', ['Unknown']);
            expect(artistModel.sortableName).toEqual('unknown artist');
            expect(artistModel.zoomHeader).toEqual('u');
        });
    });

    describe('artworkPath', () => {
        it('should return empty Gif if artistData.artworkId is undefined', () => {
            // Arrange
            artistModel.artworkId = undefined;

            // Act
            const artworkPath: string = artistModel.artworkPath;

            // Assert
            expect(artworkPath).toEqual(Constants.emptyImage);
        });

        it('should return empty Gif if artistData.artworkId is empty', () => {
            // Arrange
            artistModel.artworkId = '';

            // Act
            const artworkPath: string = artistModel.artworkPath;

            // Assert
            expect(artworkPath).toEqual(Constants.emptyImage);
        });

        it('should return empty gif if artistData.artworkId is space', () => {
            // Arrange
            artistModel.artworkId = ' ';

            // Act
            const artworkPath: string = artistModel.artworkPath;

            // Assert
            expect(artworkPath).toEqual(Constants.emptyImage);
        });

        it('should return empty gif if artistData.artworkId is the default id', () => {
            // Arrange
            artistModel.artworkId = ArtistArtworkCacheId.defaultArtworkId;

            // Act
            const artworkPath: string = artistModel.artworkPath;

            // Assert
            expect(artworkPath).toEqual(Constants.emptyImage);
        });

        it('should return full artwork path if artistData.artworkId is not undefined, empty or space.', () => {
            // Arrange
            artistModel.artworkId = 'dummy';
            applicationPathsMock
                .setup((x) => x.artistArtFullPath('dummy'))
                .returns(() => '/root/directory/dummy');

            // Act
            const artworkPath: string = artistModel.artworkPath;

            // Assert
            expect(artworkPath).toEqual('file:////root/directory/dummy');
        });
    });
});
