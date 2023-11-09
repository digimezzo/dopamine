import { IMock, Mock } from 'typemoq';
import { DateTime } from '../../common/date-time';
import { TrackModel } from '../track/track-model';
import { PlaybackInformation } from './playback-information';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { Track } from '../../data/entities/track';

describe('PlaybackInformation', () => {
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;

    beforeEach(() => {
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange
            const track: Track = new Track('Path');
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);

            // Act
            const playbackInformation = new PlaybackInformation(trackModel, 'imageUrl');

            // Assert
            expect(playbackInformation).toBeDefined();
        });

        it('should set track', () => {
            // Arrange
            const track: Track = new Track('Path');
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);

            // Act
            const playbackInformation = new PlaybackInformation(trackModel, 'imageUrl');

            // Assert
            expect(playbackInformation.track).toEqual(trackModel);
        });

        it('should set imageUrl', () => {
            // Arrange
            const track: Track = new Track('Path');
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);

            // Act
            const playbackInformation = new PlaybackInformation(trackModel, 'imageUrl');

            // Assert
            expect(playbackInformation.imageUrl).toEqual('imageUrl');
        });
    });
});
