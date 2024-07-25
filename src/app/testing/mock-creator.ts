import { IMock, Mock } from 'typemoq';
import { Track } from '../data/entities/track';
import { DateTime } from '../common/date-time';
import { ArtistInformation } from '../services/artist-information/artist-information';
import { TrackModel } from '../services/track/track-model';
import { TranslatorServiceBase } from '../services/translator/translator.service.base';
import { DesktopBase } from '../common/io/desktop.base';
import { SettingsMock } from './settings-mock';

export class MockCreator {
    public static createTrackModel(path: string, trackTitle: string, artists: string): TrackModel {
        const dateTimeMock: IMock<DateTime> = Mock.ofType<DateTime>();
        const translatorServiceMock: IMock<TranslatorServiceBase> = Mock.ofType<TranslatorServiceBase>();
        const settingsMock: any = new SettingsMock();

        const track: Track = new Track(path);
        track.trackTitle = trackTitle;
        track.artists = artists;

        return new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
    }

    public static createTrackModelWithAlbumKey(path: string, albumKey: string): TrackModel {
        const dateTimeMock: IMock<DateTime> = Mock.ofType<DateTime>();
        const translatorServiceMock: IMock<TranslatorServiceBase> = Mock.ofType<TranslatorServiceBase>();
        const settingsMock: any = new SettingsMock();

        const track: Track = new Track(path);
        track.albumKey = albumKey;

        return new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
    }

    public static createArtistInformation(name: string, url: string, imageUrl: string, biography: string): ArtistInformation {
        const desktopMock: IMock<DesktopBase> = Mock.ofType<DesktopBase>();

        return new ArtistInformation(desktopMock.object, name, url, imageUrl, biography);
    }
}
