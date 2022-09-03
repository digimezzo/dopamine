import { IMock, Mock } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { TrackModel } from './track-model';

describe('TrackModel', () => {
    let track: Track;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    beforeEach(() => {
        track = new Track('/home/user/Music/track1.mp3');
        track.trackId = 42;
        track.trackNumber = 5;
        track.discNumber = 1;
        track.discCount = 2;
        track.year = 2020;
        track.fileName = 'track1';
        track.trackTitle = 'Track title';
        track.artists = ';Artist 1;;Artist 2;';
        track.albumKey = 'albumKey1';
        track.albumTitle = 'Album title';
        track.albumArtists = ';Album artist 1;;Album artist 2;';
        track.duration = 45648713213;
        track.fileSize = 7704126;
        track.playCount = 9;
        track.skipCount = 7;
        track.rating = 4;

        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        translatorServiceMock.setup((x) => x.get('unknown-album')).returns(() => 'Unknown album');
        translatorServiceMock.setup((x) => x.get('unknown-artist')).returns(() => 'Unknown artist');
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Assert
            expect(trackModel).toBeDefined();
        });

        it('should initialize isPlaying as false', () => {
            // Arrange

            // Act
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Assert
            expect(trackModel.isPlaying).toBeFalsy();
        });

        it('should initialize isSelected as false', () => {
            // Arrange

            // Act
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Assert
            expect(trackModel.isSelected).toBeFalsy();
        });

        it('should initialize showHeader as false', () => {
            // Arrange

            // Act
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Assert
            expect(trackModel.showHeader).toBeFalsy();
        });

        it('should define playlistPath as empty', () => {
            // Arrange

            // Act
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Assert
            expect(trackModel.playlistPath).toEqual('');
        });
    });

    describe('id', () => {
        it('should return the track TrackID', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const id: number = trackModel.id;

            // Assert
            expect(id).toEqual(42);
        });
    });

    describe('path', () => {
        it('should return the track path', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const path: string = trackModel.path;

            // Assert
            expect(path).toEqual('/home/user/Music/track1.mp3');
        });
    });

    describe('fileName', () => {
        it('should return the track file name', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const path: string = trackModel.fileName;

            // Assert
            expect(path).toEqual('track1');
        });
    });

    describe('number', () => {
        it('should return the track number', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const number: number = trackModel.number;

            // Assert
            expect(number).toEqual(5);
        });
    });

    describe('discNumber', () => {
        it('should return the track discNumber', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const discNumber: number = trackModel.discNumber;

            // Assert
            expect(discNumber).toEqual(1);
        });
    });

    describe('discCount', () => {
        it('should return the track discCount', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const discCount: number = trackModel.discCount;

            // Assert
            expect(discCount).toEqual(2);
        });
    });

    describe('year', () => {
        it('should return the track year', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const year: number = trackModel.year;

            // Assert
            expect(year).toEqual(2020);
        });
    });

    describe('title', () => {
        it('should return track title if it is not empty and not undefined', () => {
            // Arrange
            track.trackTitle = 'The track title';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const title: string = trackModel.title;

            // Assert
            expect(title).toEqual('The track title');
        });

        it('should return track fileName if track title is undefined', () => {
            // Arrange
            track.trackTitle = undefined;
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const title: string = trackModel.title;

            // Assert
            expect(title).toEqual('track1');
        });

        it('should return track fileName if track title is empty', () => {
            // Arrange
            track.trackTitle = '';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const title: string = trackModel.title;

            // Assert
            expect(title).toEqual('track1');
        });
    });

    describe('sortableTitle', () => {
        it('should return the track title in lowercase', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const sortableTitle: string = trackModel.sortableTitle;

            // Assert
            expect(sortableTitle).toEqual('track title');
        });
    });

    describe('artists', () => {
        it('should return Unknown artist if track artists is undefined', () => {
            // Arrange
            track.artists = undefined;
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Unknown artist');
        });

        it('should return Unknown artist if track artists is empty', () => {
            // Arrange
            track.artists = '';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Unknown artist');
        });

        it('should return Unknown artist if track artists contains only one empty artist', () => {
            // Arrange
            track.artists = ';;';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Unknown artist');
        });

        it('should return the artist if track artists contains only one artist', () => {
            // Arrange
            track.artists = ';Artist 1;';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Artist 1');
        });

        it('should return all artists separated by a comma if track artists contains multiple artists', () => {
            // Arrange
            track.artists = ';Artist 1;;Artist 2;';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Artist 1, Artist 2');
        });

        it('should not return empty artists', () => {
            // Arrange
            track.artists = ';Artist 1;;;;Artist 3;';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Artist 1, Artist 3');
        });

        it('should not return space artists', () => {
            // Arrange
            track.artists = ';Artist 1;; ;;Artist 3;';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Artist 1, Artist 3');
        });

        it('should not return double space artists', () => {
            // Arrange
            track.artists = ';Artist 1;;  ;;Artist 3;';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Artist 1, Artist 3');
        });
    });

    describe('albumKey', () => {
        it('should return the track albumKey', () => {
            // Arrange
            const expectedAlbumKey: string = 'albumKey1';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

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
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumTitle: string = trackModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual('Unknown album');
        });

        it('should return "Unknown album" if the track album title is empty', () => {
            // Arrange
            track.albumTitle = '';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumTitle: string = trackModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual('Unknown album');
        });

        it('should return "Unknown album" if the track album title is whitespace', () => {
            // Arrange
            track.albumTitle = ' ';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumTitle: string = trackModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual('Unknown album');
        });

        it('should return the track album title if the track has an album title', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumTitle: string = trackModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual('Album title');
        });
    });

    describe('albumTitle', () => {
        it('should return the track album title in lowercase if the track has an album title', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

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
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Album artist 1');
        });

        it('should return all album artists separated by a comma if the track has multiple album artists', () => {
            // Arrange
            track.albumArtists = ';Album artist 1;;Album artist 2;';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Album artist 1, Album artist 2');
        });

        it('should return the track artist if the track has no album artists and has only 1 track artist', () => {
            // Arrange
            track.albumArtists = '';
            track.artists = ';Artist 1;';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Artist 1');
        });

        it('should return all track artists separated by a comma if the track has no album artists and has multiple track artists', () => {
            // Arrange
            track.albumArtists = '';
            track.artists = ';Artist 1;;Artist 2;';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Artist 1, Artist 2');
        });

        it('should return "Unknown artist" if the track has no album artists and no track artists', () => {
            // Arrange
            track.albumArtists = '';
            track.artists = '';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Unknown artist');
        });

        it('should return all track artists separated by a comma in lowercase if the track has no album artists and has multiple track artists', () => {
            // Arrange
            track.albumArtists = '';
            track.artists = ';Artist 1;;Artist 2;';
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const sortableAlbumArtists: string = trackModel.sortableAlbumArtists;

            // Assert
            expect(sortableAlbumArtists).toEqual('artist 1, artist 2');
        });
    });

    describe('durationInMilliseconds', () => {
        it('should return the track duration in milliseconds', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const durationInMilliseconds: number = trackModel.durationInMilliseconds;

            // Assert
            expect(durationInMilliseconds).toEqual(45648713213);
        });
    });

    describe('fileSizeInBytes', () => {
        it('should return the track file size in bytes', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const fileSizeInBytes: number = trackModel.fileSizeInBytes;

            // Assert
            expect(fileSizeInBytes).toEqual(7704126);
        });
    });

    describe('playCount', () => {
        it('should return the track play count', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const playCount: number = trackModel.playCount;

            // Assert
            expect(playCount).toEqual(9);
        });
    });

    describe('skipCount', () => {
        it('should return the track skip count', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const skipCount: number = trackModel.skipCount;

            // Assert
            expect(skipCount).toEqual(7);
        });
    });

    describe('rating', () => {
        it('should return the track rating', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            const rating: number = trackModel.rating;

            // Assert
            expect(rating).toEqual(4);
        });

        it('should set the track rating', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            trackModel.rating = 2;

            // Assert
            expect(trackModel.rating).toEqual(2);
            expect(track.rating).toEqual(2);
        });
    });

    describe('increasePlayCount', () => {
        it('should increase the track play count by 1', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            trackModel.increasePlayCount();

            // Assert
            expect(trackModel.playCount).toEqual(10);
        });
    });

    describe('increaseSkipCount', () => {
        it('should increase the track skip count by 1', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

            // Act
            trackModel.increaseSkipCount();

            // Assert
            expect(trackModel.skipCount).toEqual(8);
        });
    });
});
