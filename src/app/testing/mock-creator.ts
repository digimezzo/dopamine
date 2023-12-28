import { IMock, Mock } from 'typemoq';
import { Track } from '../data/entities/track';
import { DateTime } from '../common/date-time';
import { ArtistInformation } from '../services/artist-information/artist-information';
import { TrackModel } from '../services/track/track-model';
import { TranslatorServiceBase } from '../services/translator/translator.service.base';
import { DesktopBase } from '../common/io/desktop.base';
import { IndexablePath } from '../services/indexing/indexable-path';
import { RemovedTrack } from '../data/entities/removed-track';
import { IndexableTrack } from '../services/indexing/indexable-track';

export class MockCreator {
    public static createTrack(path: string, trackId: number): Track {
        const track: Track = new Track(path);
        track.trackId = trackId;

        return track;
    }

    public static createTrackModel(path: string, trackTitle: string, artists: string): TrackModel {
        const dateTimeMock: IMock<DateTime> = Mock.ofType<DateTime>();
        const translatorServiceMock: IMock<TranslatorServiceBase> = Mock.ofType<TranslatorServiceBase>();

        const track: Track = new Track(path);
        track.trackTitle = trackTitle;
        track.artists = artists;

        return new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
    }

    public static createTrackModelWithAlbumKey(path: string, albumKey: string): TrackModel {
        const dateTimeMock: IMock<DateTime> = Mock.ofType<DateTime>();
        const translatorServiceMock: IMock<TranslatorServiceBase> = Mock.ofType<TranslatorServiceBase>();

        const track: Track = new Track(path);
        track.albumKey = albumKey;

        return new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
    }

    public static createArtistInformation(name: string, url: string, imageUrl: string, biography: string): ArtistInformation {
        const desktopMock: IMock<DesktopBase> = Mock.ofType<DesktopBase>();

        return new ArtistInformation(desktopMock.object, name, url, imageUrl, biography);
    }

    public static createIndexablePath(path: string, dateModifedTicks: number, folderId: number): IndexablePath {
        return new IndexablePath(path, dateModifedTicks, folderId);
    }

    public static createIndexableTrack(path: string, dateModifedTicks: number, folderId: number): IndexableTrack {
        return new IndexableTrack(MockCreator.createIndexablePath(path, dateModifedTicks, folderId));
    }

    public static createRemovedTrack(path: string): RemovedTrack {
        return new RemovedTrack(path);
    }
}
