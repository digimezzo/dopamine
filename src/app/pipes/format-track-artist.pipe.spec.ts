import { IMock, Mock } from 'typemoq';
import { TranslatorService } from '../services/translator/translator.service';
import { FormatTrackArtistsPipe } from './format-track-artist.pipe';

describe('FormatTrackArtistsPipe', () => {
    let translatorServiceMock: IMock<TranslatorService>;
    let formatTrackArtistsPipe: FormatTrackArtistsPipe;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorService>();
        translatorServiceMock.setup((x) => x.get('Track.UnknownArtist')).returns(() => 'Unknown artist');
        formatTrackArtistsPipe = new FormatTrackArtistsPipe(translatorServiceMock.object);
    });

    describe('transform', () => {
        it('should return Unknown artist if track artists is undefined', () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = formatTrackArtistsPipe.transform(undefined);

            // Assert
            expect(formattedTrackArtists).toEqual('Unknown artist');
        });

        it('should return Unknown artist if track artists is empty', () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = formatTrackArtistsPipe.transform([]);

            // Assert
            expect(formattedTrackArtists).toEqual('Unknown artist');
        });

        it('should return Unknown artist if track artists contains only one empty artist', () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = formatTrackArtistsPipe.transform(['']);

            // Assert
            expect(formattedTrackArtists).toEqual('Unknown artist');
        });

        it('should return the artist if track artists contains only one artist', () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = formatTrackArtistsPipe.transform(['Artist 1']);

            // Assert
            expect(formattedTrackArtists).toEqual('Artist 1');
        });

        it('should return all artists separated by a comma if track artists contains multiple artists', () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = formatTrackArtistsPipe.transform(['Artist 1', 'Artist 2', 'Artist 3']);

            // Assert
            expect(formattedTrackArtists).toEqual('Artist 1, Artist 2, Artist 3');
        });

        it('should not return empty artists', () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = formatTrackArtistsPipe.transform(['Artist 1', '', 'Artist 3']);

            // Assert
            expect(formattedTrackArtists).toEqual('Artist 1, Artist 3');
        });

        it('should not return space artists', () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = formatTrackArtistsPipe.transform(['Artist 1', ' ', 'Artist 3']);

            // Assert
            expect(formattedTrackArtists).toEqual('Artist 1, Artist 3');
        });

        it('should not return double space artists', () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = formatTrackArtistsPipe.transform(['Artist 1', '  ', 'Artist 3']);

            // Assert
            expect(formattedTrackArtists).toEqual('Artist 1, Artist 3');
        });
        it('should not return undefined artists', () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = formatTrackArtistsPipe.transform(['Artist 1', undefined, 'Artist 3']);

            // Assert
            expect(formattedTrackArtists).toEqual('Artist 1, Artist 3');
        });
    });
});
