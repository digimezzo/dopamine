import { IMock, Mock } from 'typemoq';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { FormatAlbumArtistsPipe } from './format-album-artist.pipe';

describe('formatAlbumTitle', () => {
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let formatAlbumArtistsPipe: FormatAlbumArtistsPipe;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        translatorServiceMock.setup((x) => x.get('Album.UnknownArtist')).returns(() => 'Unknown artist');
        formatAlbumArtistsPipe = new FormatAlbumArtistsPipe(translatorServiceMock.object);
    });

    describe('transform', () => {
        it('should return "Unknown artist" if albumArtists and trackArtists are undefined', () => {
            // Arrange

            // Act
            const subfolderName: string = formatAlbumArtistsPipe.transform(undefined, undefined);

            // Assert
            expect(subfolderName).toEqual('Unknown artist');
        });

        it('should return "Unknown artist" if albumArtists and trackArtists are empty', () => {
            // Arrange

            // Act
            const subfolderName: string = formatAlbumArtistsPipe.transform([], []);

            // Assert
            expect(subfolderName).toEqual('Unknown artist');
        });

        it('should return "Unknown artist" if albumArtists is undefined and trackArtists is empty', () => {
            // Arrange

            // Act
            const subfolderName: string = formatAlbumArtistsPipe.transform(undefined, []);

            // Assert
            expect(subfolderName).toEqual('Unknown artist');
        });

        it('should return "Unknown artist" if albumArtists is empty and trackArtists is undefined', () => {
            // Arrange

            // Act
            const subfolderName: string = formatAlbumArtistsPipe.transform([], undefined);

            // Assert
            expect(subfolderName).toEqual('Unknown artist');
        });

        it('should return the first album artist if albumArtists is not undefined and not empty, and trackArtists is undefined.', () => {
            // Arrange

            // Act
            const subfolderName: string = formatAlbumArtistsPipe.transform(['Album artist 1', 'Album artist 2'], undefined);

            // Assert
            expect(subfolderName).toEqual('Album artist 1');
        });

        it('should return the first album artist if albumArtists is not undefined and not empty, and trackArtists is empty.', () => {
            // Arrange

            // Act
            const subfolderName: string = formatAlbumArtistsPipe.transform(['Album artist 1', 'Album artist 2'], []);

            // Assert
            expect(subfolderName).toEqual('Album artist 1');
        });

        it('should return the first album artist if albumArtists is not undefined and not empty, and trackArtists is not undefined and not empty.', () => {
            // Arrange

            // Act
            const subfolderName: string = formatAlbumArtistsPipe.transform(
                ['Album artist 1', 'Album artist 2'],
                ['Track artist 1', 'Track artist 2']
            );

            // Assert
            expect(subfolderName).toEqual('Album artist 1');
        });

        it('should return the first track artist if albumArtists is undefined, and trackArtists is not undefined and not empty.', () => {
            // Arrange

            // Act
            const subfolderName: string = formatAlbumArtistsPipe.transform(undefined, ['Track artist 1', 'Track artist 2']);

            // Assert
            expect(subfolderName).toEqual('Track artist 1');
        });

        it('should return the first track artist if albumArtists is empty, and trackArtists is not undefined and not empty.', () => {
            // Arrange

            // Act
            const subfolderName: string = formatAlbumArtistsPipe.transform([], ['Track artist 1', 'Track artist 2']);

            // Assert
            expect(subfolderName).toEqual('Track artist 1');
        });
    });
});
