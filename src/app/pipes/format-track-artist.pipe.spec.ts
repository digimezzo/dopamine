import { of } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { TranslatorService } from '../services/translator/translator.service';
import { FormatTrackArtistsPipe } from './format-track-artist.pipe';

describe('FormatTrackArtistsPipe', () => {
    let translatorServiceMock: IMock<TranslatorService>;
    let formatTrackArtistsPipe: FormatTrackArtistsPipe;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorService>();
        translatorServiceMock.setup((x) => x.get('Track.UnknownArtist')).returns(() => of('Unknown artist'));
        formatTrackArtistsPipe = new FormatTrackArtistsPipe(translatorServiceMock.object);
    });

    describe('transform', () => {
        it('should return Unknown artist if track artists is undefined', async () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = await formatTrackArtistsPipe.transform(undefined).toPromise();

            // Assert
            expect(formattedTrackArtists).toEqual('Unknown artist');
        });

        it('should return Unknown artist if track artists is empty', async () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = await formatTrackArtistsPipe.transform([]).toPromise();

            // Assert
            expect(formattedTrackArtists).toEqual('Unknown artist');
        });

        it('should return Unknown artist if track artists contains only one empty artist', async () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = await formatTrackArtistsPipe.transform(['']).toPromise();

            // Assert
            expect(formattedTrackArtists).toEqual('Unknown artist');
        });

        it('should return the artist if track artists contains only one artist', async () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = await formatTrackArtistsPipe.transform(['Artist 1']).toPromise();

            // Assert
            expect(formattedTrackArtists).toEqual('Artist 1');
        });

        it('should return all artists separated by a comma if track artists contains multiple artists', async () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = await formatTrackArtistsPipe.transform(['Artist 1', 'Artist 2', 'Artist 3']).toPromise();

            // Assert
            expect(formattedTrackArtists).toEqual('Artist 1, Artist 2, Artist 3');
        });

        it('should not return empty artists', async () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = await formatTrackArtistsPipe.transform(['Artist 1', '', 'Artist 3']).toPromise();

            // Assert
            expect(formattedTrackArtists).toEqual('Artist 1, Artist 3');
        });

        it('should not return space artists', async () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = await formatTrackArtistsPipe.transform(['Artist 1', ' ', 'Artist 3']).toPromise();

            // Assert
            expect(formattedTrackArtists).toEqual('Artist 1, Artist 3');
        });

        it('should not return double space artists', async () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = await formatTrackArtistsPipe.transform(['Artist 1', '  ', 'Artist 3']).toPromise();

            // Assert
            expect(formattedTrackArtists).toEqual('Artist 1, Artist 3');
        });
        it('should not return undefined artists', async () => {
            // Arrange

            // Act
            const formattedTrackArtists: string = await formatTrackArtistsPipe.transform(['Artist 1', undefined, 'Artist 3']).toPromise();

            // Assert
            expect(formattedTrackArtists).toEqual('Artist 1, Artist 3');
        });
    });
});
