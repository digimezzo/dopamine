import { IMock, Mock } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { PlaybackInformation } from './playback-information';

describe('PlaybackInformation', () => {
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    beforeEach(() => {
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange
            const track: Track = new Track('Path');
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            let playbackInformation: PlaybackInformation;

            // Act
            playbackInformation = new PlaybackInformation(trackModel, 'imageUrl');

            // Assert
            expect(playbackInformation).toBeDefined();
        });

        it('should set track', () => {
            // Arrange
            const track: Track = new Track('Path');
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            let playbackInformation: PlaybackInformation;

            // Act
            playbackInformation = new PlaybackInformation(trackModel, 'imageUrl');

            // Assert
            expect(playbackInformation.track).toEqual(trackModel);
        });

        it('should set imageUrl', () => {
            // Arrange
            const track: Track = new Track('Path');
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            let playbackInformation: PlaybackInformation;

            // Act
            playbackInformation = new PlaybackInformation(trackModel, 'imageUrl');

            // Assert
            expect(playbackInformation.imageUrl).toEqual('imageUrl');
        });
    });
});
