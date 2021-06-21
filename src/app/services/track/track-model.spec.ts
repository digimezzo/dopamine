import { IMock, Mock } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { TrackModel } from './track-model';

describe('TrackModel', () => {
    let track: Track;
    let trackModel: TrackModel;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    beforeEach(() => {
        track = new Track('/home/user/Music/track1.mp3');
        track.trackNumber = 5;
        track.discNumber = 1;
        track.discCount = 2;
        track.fileName = 'track1';
        track.trackTitle = 'Track title';
        track.artists = ';Artist 1;;Artist 2;';
        track.albumKey = 'albumKey1';
        track.albumTitle = 'Album title';
        track.albumArtists = ';Album artist 1;;Album artist 2;';
        track.duration = 45648713213;
        track.fileSize = 7704126;

        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        translatorServiceMock.setup((x) => x.get('Track.UnknownAlbum')).returns(() => 'Unknown album');
        translatorServiceMock.setup((x) => x.get('Track.UnknownArtist')).returns(() => 'Unknown artist');

        trackModel = new TrackModel(track, translatorServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(trackModel).toBeDefined();
        });

        it('should initialize isPlaying as false', () => {
            // Arrange

            // Act

            // Assert
            expect(trackModel.isPlaying).toBeFalsy();
        });

        it('should initialize isSelected as false', () => {
            // Arrange

            // Act

            // Assert
            expect(trackModel.isSelected).toBeFalsy();
        });

        it('should initialize showHeader as false', () => {
            // Arrange

            // Act

            // Assert
            expect(trackModel.showHeader).toBeFalsy();
        });
    });

    describe('path', () => {
        it('should return the track path', () => {
            // Arrange

            // Act
            const path: string = trackModel.path;

            // Assert
            expect(path).toEqual('/home/user/Music/track1.mp3');
        });
    });

    describe('fileName', () => {
        it('should return the track file name', () => {
            // Arrange

            // Act
            const path: string = trackModel.fileName;

            // Assert
            expect(path).toEqual('track1');
        });
    });

    describe('number', () => {
        it('should return the track number', () => {
            // Arrange

            // Act
            const number: number = trackModel.number;

            // Assert
            expect(number).toEqual(5);
        });
    });

    describe('discNumber', () => {
        it('should return the track discNumber', () => {
            // Arrange

            // Act
            const discNumber: number = trackModel.discNumber;

            // Assert
            expect(discNumber).toEqual(1);
        });
    });

    describe('discCount', () => {
        it('should return the track discCount', () => {
            // Arrange

            // Act
            const discCount: number = trackModel.discCount;

            // Assert
            expect(discCount).toEqual(2);
        });
    });

    describe('title', () => {
        it('should return the track title', () => {
            // Arrange

            // Act
            const title: string = trackModel.title;

            // Assert
            expect(title).toEqual('Track title');
        });
    });

    describe('sortableTitle', () => {
        it('should return the track title in lowercase', () => {
            // Arrange

            // Act
            const sortableTitle: string = trackModel.sortableTitle;

            // Assert
            expect(sortableTitle).toEqual('track title');
        });
    });

    describe('artists', () => {
        it('should return the track artists', () => {
            // Arrange
            const expectedArtists: string[] = ['Artist 1', 'Artist 2'];

            // Act
            const artists: string[] = trackModel.artists;

            // Assert
            expect(artists).toEqual(expectedArtists);
        });
    });

    describe('albumKey', () => {
        it('should return the track albumKey', () => {
            // Arrange
            const expectedAlbumKey: string = 'albumKey1';

            // Act
            const albumKey: string = trackModel.albumKey;

            // Assert
            expect(albumKey).toEqual(expectedAlbumKey);
        });
    });

    describe('albumTitle', () => {
        it('should return "Unknown album" if the track album title is undefined', () => {
            // Arrange
            track.albumTitle = undefined;

            // Act
            const albumTitle: string = trackModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual('Unknown album');
        });

        it('should return "Unknown album" if the track album title is empty', () => {
            // Arrange
            track.albumTitle = '';

            // Act
            const albumTitle: string = trackModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual('Unknown album');
        });

        it('should return "Unknown album" if the track album title is whitespace', () => {
            // Arrange
            track.albumTitle = ' ';

            // Act
            const albumTitle: string = trackModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual('Unknown album');
        });

        it('should return the track album title if the track has an album title', () => {
            // Arrange

            // Act
            const albumTitle: string = trackModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual('Album title');
        });
    });

    describe('albumTitle', () => {
        it('should return the track album title in lowercase if the track has an album title', () => {
            // Arrange

            // Act
            const sortableAlbumTitle: string = trackModel.sortableAlbumTitle;

            // Assert
            expect(sortableAlbumTitle).toEqual('album title');
        });
    });

    describe('albumArtist', () => {
        it('should return the album artist if the track has only 1 album artist', () => {
            // Arrange
            track.albumArtists = ';Album artist 1;';
            trackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Album artist 1');
        });

        it('should return all album artists separated by a comma if the track has multiple album artists', () => {
            // Arrange
            track.albumArtists = ';Album artist 1;;Album artist 2;';
            trackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Album artist 1, Album artist 2');
        });

        it('should return the track artist if the track has no album artists and has only 1 track artist', () => {
            // Arrange
            track.albumArtists = '';
            track.artists = ';Artist 1;';
            trackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Artist 1');
        });

        it('should return all track artists separated by a comma if the track has no album artists and has multiple track artists', () => {
            // Arrange
            track.albumArtists = '';
            track.artists = ';Artist 1;;Artist 2;';
            trackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Artist 1, Artist 2');
        });

        it('should return "Unknown artist" if the track has no album artists and no track artists', () => {
            // Arrange
            track.albumArtists = '';
            track.artists = '';
            trackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Unknown artist');
        });

        it('should return all track artists separated by a comma in lowercase if the track has no album artists and has multiple track artists', () => {
            // Arrange
            track.albumArtists = '';
            track.artists = ';Artist 1;;Artist 2;';
            trackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const sortableAlbumArtists: string = trackModel.sortableAlbumArtists;

            // Assert
            expect(sortableAlbumArtists).toEqual('artist 1, artist 2');
        });
    });

    describe('durationInMilliseconds', () => {
        it('should return the track duration in milliseconds', () => {
            // Arrange

            // Act
            const durationInMilliseconds: number = trackModel.durationInMilliseconds;

            // Assert
            expect(durationInMilliseconds).toEqual(45648713213);
        });
    });

    describe('fileSizeInBytes', () => {
        it('should return the track file size in bytes', () => {
            // Arrange

            // Act
            const fileSizeInBytes: number = trackModel.fileSizeInBytes;

            // Assert
            expect(fileSizeInBytes).toEqual(7704126);
        });
    });
});
