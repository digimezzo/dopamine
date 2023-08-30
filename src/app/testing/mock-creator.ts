import { IMock, Mock } from 'typemoq';
import { Track } from '../common/data/entities/track';
import { DateTime } from '../common/date-time';
import { BaseDesktop } from '../common/io/base-desktop';
import { ArtistInformation } from '../services/artist-information/artist-information';
import { TrackModel } from '../services/track/track-model';
import { BaseTranslatorService } from '../services/translator/base-translator.service';

export class MockCreator {
    public static createTrackModel(path: string, artists: string): TrackModel {
        const dateTimeMock: IMock<DateTime> = Mock.ofType<DateTime>();
        const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();

        const track: Track = new Track(path);
        track.artists = artists;

        const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);

        return trackModel;
    }

    public static createArtistInformation(name: string, url: string, imageUrl: string, biography: string): ArtistInformation {
        const desktopMock: IMock<BaseDesktop> = Mock.ofType<BaseDesktop>();

        const artistInformation: ArtistInformation = new ArtistInformation(desktopMock.object, name, url, imageUrl, biography);

        return artistInformation;
    }
}
