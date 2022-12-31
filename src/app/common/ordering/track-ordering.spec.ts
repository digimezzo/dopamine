import { IMock, Mock } from 'typemoq';
import { TrackModel } from '../../services/track/track-model';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { Track } from '../data/entities/track';
import { DateTime } from '../date-time';
import { TrackOrdering } from './track-ordering';

describe('TrackOrdering', () => {
    let track1: Track;
    let track2: Track;
    let track3: Track;
    let track4: Track;

    let trackModel1: TrackModel;
    let trackModel2: TrackModel;
    let trackModel3: TrackModel;
    let trackModel4: TrackModel;

    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let trackOrdering: TrackOrdering;
    let tracks: TrackModel[];

    beforeEach(() => {
        track1 = new Track('Path 1');
        track1.trackTitle = 'Title 1';
        track1.albumArtists = ';Album artist 1;';
        track1.albumTitle = 'Album title 1';
        track1.trackNumber = 1;
        track1.discNumber = 1;

        track2 = new Track('Path 2');
        track2.trackTitle = 'title 2';
        track2.albumArtists = ';Album artist 1;';
        track2.albumTitle = 'Album title 1';
        track2.trackNumber = 1;
        track2.discNumber = 2;

        track3 = new Track('Path 3');
        track3.trackTitle = 'Title 3';
        track3.albumArtists = ';Album artist 2;';
        track3.albumTitle = 'album title 3';
        track3.trackNumber = 1;
        track3.discNumber = 1;

        track4 = new Track('Path 4');
        track4.trackTitle = 'Title 4';
        track4.albumArtists = ';Album artist 2;';
        track4.albumTitle = 'Album title 2';
        track4.trackNumber = 2;
        track4.discNumber = 1;

        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        trackModel1 = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object);
        trackModel2 = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object);
        trackModel3 = new TrackModel(track3, dateTimeMock.object, translatorServiceMock.object);
        trackModel4 = new TrackModel(track4, dateTimeMock.object, translatorServiceMock.object);

        tracks = [trackModel2, trackModel4, trackModel1, trackModel3];

        trackOrdering = new TrackOrdering();
    });

    describe('getTracksOrderedByTitleAscending', () => {
        it('should order tracks by title ascending', () => {
            // Arrange

            // Act
            const orderedTracks: TrackModel[] = trackOrdering.getTracksOrderedByTitleAscending(tracks);

            // Assert
            expect(orderedTracks[0]).toBe(trackModel1);
            expect(orderedTracks[1]).toBe(trackModel2);
            expect(orderedTracks[2]).toBe(trackModel3);
            expect(orderedTracks[3]).toBe(trackModel4);
        });
    });

    describe('getTracksOrderedByTitleDescending', () => {
        it('should order tracks by title descending', () => {
            // Arrange

            // Act
            const orderedTracks: TrackModel[] = trackOrdering.getTracksOrderedByTitleDescending(tracks);

            // Assert
            expect(orderedTracks[0]).toBe(trackModel4);
            expect(orderedTracks[1]).toBe(trackModel3);
            expect(orderedTracks[2]).toBe(trackModel2);
            expect(orderedTracks[3]).toBe(trackModel1);
        });
    });

    describe('getTracksOrderedByAlbum', () => {
        it('should order tracks by album', () => {
            // Arrange

            // Act
            const orderedTracks: TrackModel[] = trackOrdering.getTracksOrderedByAlbum(tracks);

            // Assert
            expect(orderedTracks[0]).toBe(trackModel1);
            expect(orderedTracks[1]).toBe(trackModel2);
            expect(orderedTracks[2]).toBe(trackModel4);
            expect(orderedTracks[3]).toBe(trackModel3);
        });
    });
});
