import { IMock, Mock } from 'typemoq';
import { TrackModel } from '../../services/track/track-model';
import { DateTime } from '../date-time';
import { Track } from '../../data/entities/track';
import { TranslatorServiceBase } from '../../services/translator/translator.service.base';
import { TrackSorter } from './track-sorter';
import { SettingsMock } from '../../testing/settings-mock';
import { Logger } from '../logger';

describe('TrackSorter', () => {
    let trackModel1: TrackModel;
    let trackModel2: TrackModel;
    let trackModel3: TrackModel;
    let trackModel4: TrackModel;
    let trackModel5: TrackModel;
    let trackModel6: TrackModel;
    let trackModel7: TrackModel;
    let trackModel8: TrackModel;
    let trackModel9: TrackModel;
    let trackModel10: TrackModel;

    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let settingsMock: any;
    let loggerMock: IMock<Logger>;

    let trackSorter: TrackSorter;
    let tracks: TrackModel[];

    function createTrackModel(
        path: string,
        trackTitle: string,
        albumTitle: string,
        albumArtists: string[],
        trackNumber: number,
        discNumber: number,
    ): TrackModel {
        const track = new Track(path);
        track.trackTitle = trackTitle;
        track.albumTitle = albumTitle;
        track.albumArtists = albumArtists.map((x) => `;${x};`).join('');
        track.trackNumber = trackNumber;
        track.discNumber = discNumber;
        track.albumKey = ';' + albumTitle + ';;' + albumArtists[0] + ';';

        return new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
    }

    beforeEach(() => {
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        settingsMock = new SettingsMock();
        loggerMock = Mock.ofType<Logger>();

        trackModel1 = createTrackModel('Path 1', 'Title 1', 'Album title 1', ['Album artist 1'], 1, 1);
        trackModel2 = createTrackModel('Path 2', 'title 2', 'Album title 1', ['Album artist 1'], 1, 2);
        trackModel3 = createTrackModel('Path 3', 'Title 3', 'album title 3', ['Album artist 2'], 1, 1);
        trackModel4 = createTrackModel('Path 4', 'Title 4', 'Album title 2', ['Album artist 2'], 1, 1);
        trackModel5 = createTrackModel('Path 5', 'Title 5', 'Album title 2', ['Album artist 2'], 2, 1);
        trackModel6 = createTrackModel('Path 6', 'Title 6', 'Album title 6', ['Album artist 6'], 1, 1);
        trackModel7 = createTrackModel('Path 7', 'Title 7', 'Album title 7', ['Album artist 7'], 1, 1);
        trackModel8 = createTrackModel('Path 8', 'Title 8', 'Album title 8', ['Album artist 8'], 1, 1);
        trackModel9 = createTrackModel('Path 9', 'Title 9', 'Album title 9', ['Album artist 9'], 1, 1);
        trackModel10 = createTrackModel('Path 10', 'Title 10', 'Album title 10', ['Album artist 10'], 1, 1);

        tracks = [
            trackModel2,
            trackModel4,
            trackModel1,
            trackModel10,
            trackModel5,
            trackModel3,
            trackModel8,
            trackModel9,
            trackModel7,
            trackModel6,
        ];

        trackSorter = new TrackSorter(loggerMock.object);
    });

    describe('sortByTitleAscending', () => {
        it('should sort by title ascending', () => {
            // Arrange

            // Act
            const sortedTracks: TrackModel[] = trackSorter.sortByTitleAscending(tracks);

            // Assert
            expect(sortedTracks[0]).toBe(trackModel1);
            expect(sortedTracks[1]).toBe(trackModel2);
            expect(sortedTracks[2]).toBe(trackModel3);
            expect(sortedTracks[3]).toBe(trackModel4);
            expect(sortedTracks[4]).toBe(trackModel5);
            expect(sortedTracks[5]).toBe(trackModel6);
            expect(sortedTracks[6]).toBe(trackModel7);
            expect(sortedTracks[7]).toBe(trackModel8);
            expect(sortedTracks[8]).toBe(trackModel9);
            expect(sortedTracks[9]).toBe(trackModel10);
        });
    });

    describe('sortByTitleDescending', () => {
        it('should sort by title descending', () => {
            // Arrange

            // Act
            const sortedTracks: TrackModel[] = trackSorter.sortByTitleDescending(tracks);

            // Assert
            expect(sortedTracks[0]).toBe(trackModel10);
            expect(sortedTracks[1]).toBe(trackModel9);
            expect(sortedTracks[2]).toBe(trackModel8);
            expect(sortedTracks[3]).toBe(trackModel7);
            expect(sortedTracks[4]).toBe(trackModel6);
            expect(sortedTracks[5]).toBe(trackModel5);
            expect(sortedTracks[6]).toBe(trackModel4);
            expect(sortedTracks[7]).toBe(trackModel3);
            expect(sortedTracks[8]).toBe(trackModel2);
            expect(sortedTracks[9]).toBe(trackModel1);
        });
    });

    describe('sortByAlbum', () => {
        it('should sort by album', () => {
            // Arrange

            // Act
            const sortedTracks: TrackModel[] = trackSorter.sortByAlbum(tracks);

            // Assert
            expect(sortedTracks[0]).toBe(trackModel1);
            expect(sortedTracks[1]).toBe(trackModel4);
            expect(sortedTracks[2]).toBe(trackModel5);
            expect(sortedTracks[3]).toBe(trackModel3);
            expect(sortedTracks[4]).toBe(trackModel6);
            expect(sortedTracks[5]).toBe(trackModel7);
            expect(sortedTracks[6]).toBe(trackModel8);
            expect(sortedTracks[7]).toBe(trackModel9);
            expect(sortedTracks[8]).toBe(trackModel10);
            expect(sortedTracks[9]).toBe(trackModel2);
        });
    });
});
