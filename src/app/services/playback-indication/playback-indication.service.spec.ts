import { IMock, Mock } from 'typemoq';
import { PathValidator } from '../../core/path-validator';
import { Track } from '../../data/entities/track';
import { SubfolderModel } from '../folder/subfolder-model';
import { TrackModel } from '../track/track-model';
import { PlaybackIndicationService } from './playback-indication.service';

describe('SnackBarService', () => {
    let pathValidator: IMock<PathValidator>;

    let service: PlaybackIndicationService;

    beforeEach(() => {
        pathValidator = Mock.ofType<PathValidator>();

        service = new PlaybackIndicationService(pathValidator.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('setPlayingSubfolder', () => {
        it('should not throw an error when subfolders is undefined', () => {
            // Arrange
            const playingTrack: TrackModel = new TrackModel(new Track('/home/user/Music/track1.mp3'));

            // Act
            service.setPlayingSubfolder(undefined, playingTrack);

            // Assert
        });

        it('should not throw an error when playingTrack is undefined', () => {
            // Arrange
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/Subfolder1', true);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/Subfolder2', false);
            const subfolder3: SubfolderModel = new SubfolderModel('/home/user/Music/Subfolder3', false);
            const subfolders: SubfolderModel[] = [subfolder1, subfolder2, subfolder3];

            // Act
            service.setPlayingSubfolder(subfolders, undefined);

            // Assert
        });

        it('should not throw an error when subfolders and playingTrack are undefined', () => {
            // Arrange

            // Act
            service.setPlayingSubfolder(undefined, undefined);

            // Assert
        });

        it('should set a subfolder as playing if it is not a gotToParent subfolder and its path is a parent path of the playing track', () => {
            // Arrange
            const playingTrack: TrackModel = new TrackModel(new Track('/home/user/Music/Subfolder1/track1.mp3'));
            const isGoToParentSubfolder: SubfolderModel = new SubfolderModel('/home/user/Music/Subfolder1', true);
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/Subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/Subfolder2', false);
            const subfolder3: SubfolderModel = new SubfolderModel('/home/user/Music/Subfolder3', false);
            const subfolders: SubfolderModel[] = [isGoToParentSubfolder, subfolder1, subfolder2, subfolder3];

            pathValidator
                .setup((x) => x.isParentPath('/home/user/Music/Subfolder1', '/home/user/Music/Subfolder1/track1.mp3'))
                .returns(() => true);
            pathValidator
                .setup((x) => x.isParentPath('/home/user/Music/Subfolder2', '/home/user/Music/Subfolder1/track1.mp3'))
                .returns(() => false);
            pathValidator
                .setup((x) => x.isParentPath('/home/user/Music/Subfolder3', '/home/user/Music/Subfolder1/track1.mp3'))
                .returns(() => false);

            // Act
            service.setPlayingSubfolder(subfolders, playingTrack);

            // Assert
            expect(subfolders[0].isPlaying).toBeFalsy();
            expect(subfolders[1].isPlaying).toBeTruthy();
            expect(subfolders[2].isPlaying).toBeFalsy();
            expect(subfolders[3].isPlaying).toBeFalsy();
        });
    });

    describe('setPlayingTrack', () => {
        it('should not throw an error when tracks is undefined', () => {
            // Arrange
            const playingTrack: TrackModel = new TrackModel(new Track('/home/user/Music/track1.mp3'));

            // Act
            service.setPlayingTrack(undefined, playingTrack);

            // Assert
        });

        it('should not throw an error when playingTrack is undefined', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            // Act
            service.setPlayingTrack(tracks, undefined);

            // Assert
        });

        it('should not throw an error when tracks and playingTrack are undefined', () => {
            // Arrange

            // Act
            service.setPlayingTrack(undefined, undefined);

            // Assert
        });

        it('should set the playing track when tracks and playingTrack are defined', () => {
            // Arrange
            const playingTrack: TrackModel = new TrackModel(new Track('/home/user/Music/track2.mp3'));
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            // Act
            service.setPlayingTrack(tracks, playingTrack);

            // Assert
            expect(tracks[0].isPlaying).toBeFalsy();
            expect(tracks[1].isPlaying).toBeTruthy();
            expect(tracks[2].isPlaying).toBeFalsy();
        });
    });
});
