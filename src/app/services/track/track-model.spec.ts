import { IMock, Mock } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { TrackModel } from './track-model';

describe('TrackModel', () => {
    let track: Track;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    beforeEach(() => {
        track = new Track('/home/user/Music/Track1.mp3');
        track.trackId = 42;
        track.trackNumber = 5;
        track.discNumber = 1;
        track.discCount = 2;
        track.year = 2020;
        track.fileName = 'Track1.mp3';
        track.trackTitle = 'Track title';
        track.artists = ';Artist 1;;Artist 2;';
        track.genres = ';Genre 1;;Genre 2;';
        track.albumKey = 'albumKey1';
        track.albumTitle = 'Album title';
        track.albumArtists = ';Album artist 1;;Album artist 2;';
        track.duration = 45648713213;
        track.fileSize = 7704126;
        track.playCount = 9;
        track.skipCount = 7;
        track.rating = 4;
        track.love = -1;
        track.dateAdded = 89;
        track.dateLastPlayed = 74;

        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        translatorServiceMock.setup((x) => x.get('unknown-album')).returns(() => 'Unknown album');
        translatorServiceMock.setup((x) => x.get('unknown-artist')).returns(() => 'Unknown artist');
        translatorServiceMock.setup((x) => x.get('unknown-genre')).returns(() => 'Unknown genre');
    });

    function createTrackModel(): TrackModel {
        return new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const trackModel: TrackModel = createTrackModel();

            // Assert
            expect(trackModel).toBeDefined();
        });

        it('should initialize isPlaying as false', () => {
            // Arrange

            // Act
            const trackModel: TrackModel = createTrackModel();

            // Assert
            expect(trackModel.isPlaying).toBeFalsy();
        });

        it('should initialize isSelected as false', () => {
            // Arrange

            // Act
            const trackModel: TrackModel = createTrackModel();

            // Assert
            expect(trackModel.isSelected).toBeFalsy();
        });

        it('should initialize showHeader as false', () => {
            // Arrange

            // Act
            const trackModel: TrackModel = createTrackModel();

            // Assert
            expect(trackModel.showHeader).toBeFalsy();
        });

        it('should define playlistPath as empty', () => {
            // Arrange

            // Act
            const trackModel: TrackModel = createTrackModel();

            // Assert
            expect(trackModel.playlistPath).toEqual('');
        });
    });

    describe('id', () => {
        it('should return the track TrackID', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const id: number = trackModel.id;

            // Assert
            expect(id).toEqual(42);
        });
    });

    describe('path', () => {
        it('should return the track path', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const path: string = trackModel.path;

            // Assert
            expect(path).toEqual('/home/user/Music/Track1.mp3');
        });
    });

    describe('fileName', () => {
        it('should return the track file name', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const path: string = trackModel.fileName;

            // Assert
            expect(path).toEqual('Track1.mp3');
        });
    });

    describe('number', () => {
        it('should return the track number', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const number: number = trackModel.number;

            // Assert
            expect(number).toEqual(5);
        });
    });

    describe('discNumber', () => {
        it('should return the track discNumber', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const discNumber: number = trackModel.discNumber;

            // Assert
            expect(discNumber).toEqual(1);
        });
    });

    describe('discCount', () => {
        it('should return the track discCount', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const discCount: number = trackModel.discCount;

            // Assert
            expect(discCount).toEqual(2);
        });
    });

    describe('year', () => {
        it('should return the track year', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

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
            const trackModel: TrackModel = createTrackModel();

            // Act
            const title: string = trackModel.title;

            // Assert
            expect(title).toEqual('The track title');
        });

        it('should return track fileName if track title is undefined', () => {
            // Arrange
            track.trackTitle = undefined;
            const trackModel: TrackModel = createTrackModel();

            // Act
            const title: string = trackModel.title;

            // Assert
            expect(title).toEqual('Track1.mp3');
        });

        it('should return track fileName if track title is empty', () => {
            // Arrange
            track.trackTitle = '';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const title: string = trackModel.title;

            // Assert
            expect(title).toEqual('Track1.mp3');
        });
    });

    describe('sortableTitle', () => {
        it('should return the track title in lowercase', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const sortableTitle: string = trackModel.sortableTitle;

            // Assert
            expect(sortableTitle).toEqual('track title');
        });
    });

    describe('artists', () => {
        it('should return "Unknown artist" if track artists is undefined', () => {
            // Arrange
            track.artists = undefined;
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Unknown artist');
        });

        it('should return "Unknown artist" if track artists is empty', () => {
            // Arrange
            track.artists = '';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Unknown artist');
        });

        it('should return "Unknown artist" if track artists contains only one empty artist', () => {
            // Arrange
            track.artists = ';;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Unknown artist');
        });

        it('should return the artist if track artists contains only one artist', () => {
            // Arrange
            track.artists = ';Artist 1;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Artist 1');
        });

        it('should return all artists separated by a comma if track artists contains multiple artists', () => {
            // Arrange
            track.artists = ';Artist 1;;Artist 2;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Artist 1, Artist 2');
        });

        it('should not return empty artists', () => {
            // Arrange
            track.artists = ';Artist 1;;;;Artist 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Artist 1, Artist 3');
        });

        it('should not return space artists', () => {
            // Arrange
            track.artists = ';Artist 1;; ;;Artist 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Artist 1, Artist 3');
        });

        it('should not return double space artists', () => {
            // Arrange
            track.artists = ';Artist 1;;  ;;Artist 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.artists;

            // Assert
            expect(artists).toEqual('Artist 1, Artist 3');
        });
    });

    describe('rawArtists', () => {
        it('should return an empty array if track artists is undefined', () => {
            // Arrange
            track.artists = undefined;
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawArtists: string[] = trackModel.rawArtists;

            // Assert
            expect(rawArtists).toEqual([]);
        });

        it('should return an empty array if track artists is empty', () => {
            // Arrange
            track.artists = '';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawArtists: string[] = trackModel.rawArtists;

            // Assert
            expect(rawArtists).toEqual([]);
        });

        it('should return an empty array if track artists contains only one empty artist', () => {
            // Arrange
            track.artists = ';;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawArtists: string[] = trackModel.rawArtists;

            // Assert
            expect(rawArtists).toEqual([]);
        });

        it('should return an array containing the artist if track artists contains only one artist', () => {
            // Arrange
            track.artists = ';Artist 1;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawArtists: string[] = trackModel.rawArtists;

            // Assert
            expect(rawArtists).toEqual(['Artist 1']);
        });

        it('should return an array containing all artists if track artists contains multiple artists', () => {
            // Arrange
            track.artists = ';Artist 1;;Artist 2;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawArtists: string[] = trackModel.rawArtists;

            // Assert
            expect(rawArtists).toEqual(['Artist 1', 'Artist 2']);
        });

        it('should not return empty artists', () => {
            // Arrange
            track.artists = ';Artist 1;;;;Artist 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawArtists: string[] = trackModel.rawArtists;

            // Assert
            expect(rawArtists).toEqual(['Artist 1', 'Artist 3']);
        });

        it('should not return space artists', () => {
            // Arrange
            track.artists = ';Artist 1;; ;;Artist 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawArtists: string[] = trackModel.rawArtists;

            // Assert
            expect(rawArtists).toEqual(['Artist 1', 'Artist 3']);
        });

        it('should not return double space artists', () => {
            // Arrange
            track.artists = ';Artist 1;;  ;;Artist 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawArtists: string[] = trackModel.rawArtists;

            // Assert
            expect(rawArtists).toEqual(['Artist 1', 'Artist 3']);
        });
    });

    describe('rawFirstArtist', () => {
        it('should return an empty string if track artists is undefined', () => {
            // Arrange
            track.artists = undefined;
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawFirstArtist: string = trackModel.rawFirstArtist;

            // Assert
            expect(rawFirstArtist).toEqual('');
        });

        it('should return an empty string if track artists is empty', () => {
            // Arrange
            track.artists = '';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawFirstArtist: string = trackModel.rawFirstArtist;

            // Assert
            expect(rawFirstArtist).toEqual('');
        });

        it('should return an empty string if track artists contains only one empty artist', () => {
            // Arrange
            track.artists = ';;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawFirstArtist: string = trackModel.rawFirstArtist;

            // Assert
            expect(rawFirstArtist).toEqual('');
        });

        it('should return the artist if track artists contains only one artist', () => {
            // Arrange
            track.artists = ';Artist 1;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawFirstArtist: string = trackModel.rawFirstArtist;

            // Assert
            expect(rawFirstArtist).toEqual('Artist 1');
        });

        it('should return the first artist if track artists contains multiple artists', () => {
            // Arrange
            track.artists = ';Artist 1;;Artist 2;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawFirstArtist: string = trackModel.rawFirstArtist;

            // Assert
            expect(rawFirstArtist).toEqual('Artist 1');
        });

        it('should return the first non-empty artist', () => {
            // Arrange
            track.artists = ';;;Artist 1;;Artist 2;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawFirstArtist: string = trackModel.rawFirstArtist;

            // Assert
            expect(rawFirstArtist).toEqual('Artist 1');
        });

        it('should return the first non-space artist', () => {
            // Arrange
            track.artists = '; ;;Artist 1;;Artist 2;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawFirstArtist: string = trackModel.rawFirstArtist;

            // Assert
            expect(rawFirstArtist).toEqual('Artist 1');
        });

        it('should return the first non-double space artist', () => {
            // Arrange
            track.artists = ';   ;;Artist 1;;Artist 2;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawFirstArtist: string = trackModel.rawFirstArtist;

            // Assert
            expect(rawFirstArtist).toEqual('Artist 1');
        });
    });

    describe('genres', () => {
        it('should return "Unknown genre" if track genres is undefined', () => {
            // Arrange
            track.genres = undefined;
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.genres;

            // Assert
            expect(genres).toEqual('Unknown genre');
        });

        it('should return "Unknown genre" if track genres is empty', () => {
            // Arrange
            track.genres = '';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.genres;

            // Assert
            expect(genres).toEqual('Unknown genre');
        });

        it('should return "Unknown genre" if track genre contains only one empty genr', () => {
            // Arrange
            track.genres = ';;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.genres;

            // Assert
            expect(genres).toEqual('Unknown genre');
        });

        it('should return the genre if track genres contains only one genre', () => {
            // Arrange
            track.genres = ';Genre 1;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.genres;

            // Assert
            expect(genres).toEqual('Genre 1');
        });

        it('should return all genres separated by a comma if track genres contains multiple genres', () => {
            // Arrange
            track.genres = ';Genre 1;;Genre 2;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.genres;

            // Assert
            expect(genres).toEqual('Genre 1, Genre 2');
        });

        it('should not return empty genres', () => {
            // Arrange
            track.genres = ';Genre 1;;;;Genre 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.genres;

            // Assert
            expect(genres).toEqual('Genre 1, Genre 3');
        });

        it('should not return space genres', () => {
            // Arrange
            track.genres = ';Genre 1;; ;;Genre 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.genres;

            // Assert
            expect(genres).toEqual('Genre 1, Genre 3');
        });

        it('should not return double space genres', () => {
            // Arrange
            track.genres = ';Genre 1;;  ;;Genre 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.genres;

            // Assert
            expect(genres).toEqual('Genre 1, Genre 3');
        });
    });

    describe('albumKey', () => {
        it('should return the track albumKey', () => {
            // Arrange
            const expectedAlbumKey: string = 'albumKey1';
            const trackModel: TrackModel = createTrackModel();

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
            const trackModel: TrackModel = createTrackModel();

            // Act
            const albumTitle: string = trackModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual('Unknown album');
        });

        it('should return "Unknown album" if the track album title is empty', () => {
            // Arrange
            track.albumTitle = '';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const albumTitle: string = trackModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual('Unknown album');
        });

        it('should return "Unknown album" if the track album title is whitespace', () => {
            // Arrange
            track.albumTitle = ' ';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const albumTitle: string = trackModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual('Unknown album');
        });

        it('should return the track album title if the track has an album title', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const albumTitle: string = trackModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual('Album title');
        });
    });

    describe('rawAlbumTitle', () => {
        it('should return an empty string if the track album title is undefined', () => {
            // Arrange
            track.albumTitle = undefined;
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawAlbumTitle: string = trackModel.rawAlbumTitle;

            // Assert
            expect(rawAlbumTitle).toEqual('');
        });

        it('should return an empty string if the track album title is empty', () => {
            // Arrange
            track.albumTitle = '';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawAlbumTitle: string = trackModel.rawAlbumTitle;

            // Assert
            expect(rawAlbumTitle).toEqual('');
        });

        it('should return an empty string if the track album title is whitespace', () => {
            // Arrange
            track.albumTitle = ' ';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawAlbumTitle: string = trackModel.rawAlbumTitle;

            // Assert
            expect(rawAlbumTitle).toEqual('');
        });

        it('should return the track album title if the track has an album title', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rawAlbumTitle: string = trackModel.albumTitle;

            // Assert
            expect(rawAlbumTitle).toEqual('Album title');
        });
    });

    describe('albumTitle', () => {
        it('should return the track album title in lowercase if the track has an album title', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

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
            const trackModel: TrackModel = createTrackModel();

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Album artist 1');
        });

        it('should return all album artists separated by a comma if the track has multiple album artists', () => {
            // Arrange
            track.albumArtists = ';Album artist 1;;Album artist 2;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Album artist 1, Album artist 2');
        });

        it('should return the track artist if the track has no album artists and has only 1 track artist', () => {
            // Arrange
            track.albumArtists = '';
            track.artists = ';Artist 1;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Artist 1');
        });

        it('should return all track artists separated by a comma if the track has no album artists and has multiple track artists', () => {
            // Arrange
            track.albumArtists = '';
            track.artists = ';Artist 1;;Artist 2;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Artist 1, Artist 2');
        });

        it('should return "Unknown artist" if the track has no album artists and no track artists', () => {
            // Arrange
            track.albumArtists = '';
            track.artists = '';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const albumArtists: string = trackModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual('Unknown artist');
        });

        it('should return all track artists separated by a comma in lowercase if the track has no album artists and has multiple track artists', () => {
            // Arrange
            track.albumArtists = '';
            track.artists = ';Artist 1;;Artist 2;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const sortableAlbumArtists: string = trackModel.sortableAlbumArtists;

            // Assert
            expect(sortableAlbumArtists).toEqual('artist 1, artist 2');
        });
    });

    describe('durationInMilliseconds', () => {
        it('should return the track duration in milliseconds', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const durationInMilliseconds: number = trackModel.durationInMilliseconds;

            // Assert
            expect(durationInMilliseconds).toEqual(45648713213);
        });
    });

    describe('fileSizeInBytes', () => {
        it('should return the track file size in bytes', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const fileSizeInBytes: number = trackModel.fileSizeInBytes;

            // Assert
            expect(fileSizeInBytes).toEqual(7704126);
        });
    });

    describe('playCount', () => {
        it('should return the track play count', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const playCount: number = trackModel.playCount;

            // Assert
            expect(playCount).toEqual(9);
        });
    });

    describe('skipCount', () => {
        it('should return the track skip count', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const skipCount: number = trackModel.skipCount;

            // Assert
            expect(skipCount).toEqual(7);
        });
    });

    describe('rating', () => {
        it('should return the track rating', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const rating: number = trackModel.rating;

            // Assert
            expect(rating).toEqual(4);
        });

        it('should set the track rating', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            trackModel.rating = 2;

            // Assert
            expect(trackModel.rating).toEqual(2);
            expect(track.rating).toEqual(2);
        });
    });

    describe('love', () => {
        it('should return the track love', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const love: number = trackModel.love;

            // Assert
            expect(love).toEqual(-1);
        });

        it('should set the track love', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            trackModel.love = 1;

            // Assert
            expect(trackModel.love).toEqual(1);
            expect(track.love).toEqual(1);
        });
    });

    describe('increasePlayCount', () => {
        it('should increase the track play count by 1', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            trackModel.increasePlayCountAndDateLastPlayed();

            // Assert
            expect(trackModel.playCount).toEqual(10);
        });
    });

    describe('increaseSkipCount', () => {
        it('should increase the track skip count by 1', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            trackModel.increaseSkipCount();

            // Assert
            expect(trackModel.skipCount).toEqual(8);
        });
    });

    describe('dateLastPlayed', () => {
        it('should return the track date last played', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const dateLastPlayed: number = trackModel.dateLastPlayed;

            // Assert
            expect(dateLastPlayed).toEqual(74);
        });
    });

    describe('dateAdded', () => {
        it('should return the track date added', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const dateAdded: number = trackModel.dateAdded;

            // Assert
            expect(dateAdded).toEqual(89);
        });
    });

    describe('sortableTitle', () => {
        it('Should return the track title in sortable form if there is a track title', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel();

            // Act
            const sortableTitle: string = trackModel.sortableTitle;

            // Assert
            expect(sortableTitle).toEqual('track title');
        });

        it('Should return the track file name in sortable form if there is no track title', () => {
            // Arrange
            track.trackTitle = '';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const sortableTitle: string = trackModel.sortableTitle;

            // Assert
            expect(sortableTitle).toEqual('track1.mp3');
        });
    });

    describe('Sortable artists', () => {
        it('should return "unknown artist" if track artists is undefined', () => {
            // Arrange
            track.artists = undefined;
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.sortableArtists;

            // Assert
            expect(artists).toEqual('unknown artist');
        });

        it('should return "unknown artist" if track artists is empty', () => {
            // Arrange
            track.artists = '';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.sortableArtists;

            // Assert
            expect(artists).toEqual('unknown artist');
        });

        it('should return "unknown artist" if track artists contains only one empty artist', () => {
            // Arrange
            track.artists = ';;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.sortableArtists;

            // Assert
            expect(artists).toEqual('unknown artist');
        });

        it('should return the artist in sortable form if track artists contains only one artist', () => {
            // Arrange
            track.artists = ';Artist 1;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.sortableArtists;

            // Assert
            expect(artists).toEqual('artist 1');
        });

        it('should return all artists in sortable form separated by a comma if track artists contains multiple artists', () => {
            // Arrange
            track.artists = ';Artist 1;;Artist 2;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.sortableArtists;

            // Assert
            expect(artists).toEqual('artist 1, artist 2');
        });

        it('should not return empty artists', () => {
            // Arrange
            track.artists = ';Artist 1;;;;Artist 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.sortableArtists;

            // Assert
            expect(artists).toEqual('artist 1, artist 3');
        });

        it('should not return space artists', () => {
            // Arrange
            track.artists = ';Artist 1;; ;;Artist 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.sortableArtists;

            // Assert
            expect(artists).toEqual('artist 1, artist 3');
        });

        it('should not return double space artists', () => {
            // Arrange
            track.artists = ';Artist 1;;  ;;Artist 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const artists: string = trackModel.sortableArtists;

            // Assert
            expect(artists).toEqual('artist 1, artist 3');
        });
    });

    describe('sortableGenres', () => {
        it('should return "unknown genre" if track genres is undefined', () => {
            // Arrange
            track.genres = undefined;
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.sortableGenres;

            // Assert
            expect(genres).toEqual('unknown genre');
        });

        it('should return "unknown genre" if track genres is empty', () => {
            // Arrange
            track.genres = '';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.sortableGenres;

            // Assert
            expect(genres).toEqual('unknown genre');
        });

        it('should return "unknown genre" if track genre contains only one empty genre', () => {
            // Arrange
            track.genres = ';;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.sortableGenres;

            // Assert
            expect(genres).toEqual('unknown genre');
        });

        it('should return the genre in sortable form if track genres contains only one genre', () => {
            // Arrange
            track.genres = ';Genre 1;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.sortableGenres;

            // Assert
            expect(genres).toEqual('genre 1');
        });

        it('should return all genres in sortable form separated by a comma if track genres contains multiple genres', () => {
            // Arrange
            track.genres = ';Genre 1;;Genre 2;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.sortableGenres;

            // Assert
            expect(genres).toEqual('genre 1, genre 2');
        });

        it('should not return empty genres', () => {
            // Arrange
            track.genres = ';Genre 1;;;;Genre 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.sortableGenres;

            // Assert
            expect(genres).toEqual('genre 1, genre 3');
        });

        it('should not return space genres', () => {
            // Arrange
            track.genres = ';Genre 1;; ;;Genre 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.sortableGenres;

            // Assert
            expect(genres).toEqual('genre 1, genre 3');
        });

        it('should not return double space genres', () => {
            // Arrange
            track.genres = ';Genre 1;;  ;;Genre 3;';
            const trackModel: TrackModel = createTrackModel();

            // Act
            const genres: string = trackModel.sortableGenres;

            // Assert
            expect(genres).toEqual('genre 1, genre 3');
        });
    });
});
