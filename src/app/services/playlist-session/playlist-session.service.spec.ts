import { Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { DateTime } from '../../common/date-time';
import { Logger } from '../../common/logger';
import { Shuffler } from '../../common/shuffler';
import { Track } from '../../data/entities/track';
import { FileAccessBase } from '../../common/io/file-access.base';
import { SettingsMock } from '../../testing/settings-mock';
import { PlaylistSessionRepositoryBase } from '../../data/repositories/playlist-session-repository.base';
import { DialogServiceBase } from '../dialog/dialog.service.base';
import { LoopMode } from '../playback/loop-mode';
import { PlaybackService } from '../playback/playback.service';
import { PlaybackStarted } from '../playback/playback-started';
import { Queue } from '../playback/queue';
import { PlaylistModel } from '../playlist/playlist-model';
import { PlaylistServiceBase } from '../playlist/playlist.service.base';
import { TrackModel } from '../track/track-model';
import { TrackModels } from '../track/track-models';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { PlaylistSession } from './playlist-session';
import { PlaylistSessionService } from './playlist-session.service';

describe('PlaylistSessionService', () => {
    let queue: Queue;
    let playbackStarted: Subject<PlaybackStarted>;
    let playbackServiceMock: IMock<PlaybackService>;
    let playlistServiceMock: IMock<PlaylistServiceBase>;
    let dialogServiceMock: IMock<DialogServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let settingsMock: SettingsMock;
    let fileAccessMock: IMock<FileAccessBase>;
    let stored: Map<string, PlaylistSession>;
    let repositoryMock: IMock<PlaylistSessionRepositoryBase>;
    let playlistTracks: TrackModel[];
    let playlist: PlaylistModel;
    let loopMode: LoopMode;
    let isShuffled: boolean;
    let playedByPlaybackService: string[];

    function createTrackModel(path: string): TrackModel {
        return new TrackModel(new Track(path), Mock.ofType<DateTime>().object, Mock.ofType<TranslatorServiceBase>().object, '');
    }

    function play(track: TrackModel): void {
        playedByPlaybackService.push(track.path);
        playbackStarted.next(new PlaybackStarted(track, false));
    }

    function createService(): PlaylistSessionService {
        return new PlaylistSessionService(
            playbackServiceMock.object,
            playlistServiceMock.object,
            queue,
            repositoryMock.object,
            fileAccessMock.object,
            dialogServiceMock.object,
            translatorServiceMock.object,
            Mock.ofType<Logger>().object,
        );
    }

    beforeEach(() => {
        settingsMock = new SettingsMock();
        fileAccessMock = Mock.ofType<FileAccessBase>();
        fileAccessMock.setup((x) => x.pathExists(It.isAny())).returns(() => true);
        fileAccessMock.setup((x) => x.getDirectoryPath(It.isAny())).returns(() => '/playlists');
        stored = new Map();
        repositoryMock = Mock.ofType<PlaylistSessionRepositoryBase>();
        repositoryMock.setup((x) => x.getSessions()).returns(() => Array.from(stored.values()));
        repositoryMock
            .setup((x) => x.saveSession(It.isAny()))
            .callback((x: PlaylistSession) => stored.set(x.playlistPath, JSON.parse(JSON.stringify(x)) as PlaylistSession));
        repositoryMock.setup((x) => x.deleteSession(It.isAny())).callback((x: string) => stored.delete(x));
        queue = new Queue(Mock.ofType<Shuffler>().object, Mock.ofType<Logger>().object);
        playbackStarted = new Subject<PlaybackStarted>();
        playedByPlaybackService = [];
        loopMode = LoopMode.None;
        isShuffled = false;

        playbackServiceMock = Mock.ofType<PlaybackService>();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackStarted.asObservable());
        playbackServiceMock.setup((x) => x.loopMode).returns(() => loopMode);
        playbackServiceMock.setup((x) => x.isShuffled).returns(() => isShuffled);
        playbackServiceMock
            .setup((x) => x.toggleLoopMode())
            .callback(() => (loopMode = loopMode === LoopMode.None ? LoopMode.All : LoopMode.One));
        playbackServiceMock.setup((x) => x.toggleIsShuffled()).callback(() => (isShuffled = !isShuffled));
        playbackServiceMock
            .setup((x) => x.enqueueAndPlayTracksAsync(It.isAny()))
            .returns((tracks: TrackModel[]) => {
                queue.setTracks(tracks, false);
                play(queue.getFirstTrack()!);
                return Promise.resolve();
            });
        playbackServiceMock
            .setup((x) => x.playQueuedTrackAsync(It.isAny()))
            .returns((track: TrackModel) => {
                play(track);
                return Promise.resolve();
            });

        playlist = new PlaylistModel('Playlist', '', '/playlists/p.m3u', '', false);
        playlistTracks = ['/a.mp3', '/b.mp3', '/c.mp3', '/d.mp3'].map((x) => createTrackModel(x));
        playlistServiceMock = Mock.ofType<PlaylistServiceBase>();
        playlistServiceMock
            .setup((x) => x.getTracksAsync(It.isAny()))
            .returns(() => {
                const models: TrackModels = new TrackModels();
                playlistTracks.forEach((t) => models.addTrack(t));
                return Promise.resolve(models);
            });

        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        translatorServiceMock.setup((x) => x.getAsync(It.isAny())).returns(() => Promise.resolve('changed'));
    });

    function storedSessions(): PlaylistSession[] {
        return Array.from(stored.values());
    }

    it('should persist a session with played tracks, loop and shuffle', async () => {
        const service: PlaylistSessionService = createService();
        loopMode = LoopMode.All;

        await service.enqueueAndPlayPlaylistAsync(playlist);
        play(queue.tracks[1]);

        const sessions: PlaylistSession[] = storedSessions();
        expect(sessions.length).toBe(1);
        expect(sessions[0].playedPaths).toEqual(['/a.mp3', '/b.mp3']);
        expect(sessions[0].loopMode).toBe(LoopMode.All);
        expect(service.hasSession(playlist.path)).toBe(true);
    });

    it('should remove the session when all tracks have been played', async () => {
        const service: PlaylistSessionService = createService();

        await service.enqueueAndPlayPlaylistAsync(playlist);
        queue.tracks.slice(1).forEach((t) => play(t));

        expect(service.hasSession(playlist.path)).toBe(false);
    });

    it('should stop recording when another queue is enqueued', async () => {
        const service: PlaylistSessionService = createService();

        await service.enqueueAndPlayPlaylistAsync(playlist);
        queue.setTracks([createTrackModel('/other.mp3')], false);
        play(queue.tracks[0]);

        expect(storedSessions()[0].playedPaths).toEqual(['/a.mp3']);
    });

    it('should resume from the first unplayed track using the stored order, loop and shuffle', async () => {
        const session: PlaylistSession = {
            playlistPath: playlist.path,
            trackPaths: ['/a.mp3', '/b.mp3', '/c.mp3', '/d.mp3'],
            playbackOrder: ['/c.mp3', '/a.mp3', '/d.mp3', '/b.mp3'],
            playedPaths: ['/c.mp3', '/a.mp3'],
            loopMode: LoopMode.All,
            isShuffled: true,
        };
        stored.set(session.playlistPath, session);
        const service: PlaylistSessionService = createService();

        await service.resumeSessionAsync(playlist);

        expect(playedByPlaybackService).toEqual(['/d.mp3']);
        expect(queue.tracksInPlaybackOrder.map((x) => x.path)).toEqual(session.playbackOrder);
        expect(loopMode).toBe(LoopMode.All);
        expect(isShuffled).toBe(true);
        expect(storedSessions()[0].playedPaths).toEqual(['/c.mp3', '/a.mp3', '/d.mp3']);
    });

    it('should warn, discard the session and play from the start when the playlist has changed', async () => {
        const session: PlaylistSession = {
            playlistPath: playlist.path,
            trackPaths: ['/a.mp3', '/b.mp3'],
            playbackOrder: ['/b.mp3', '/a.mp3'],
            playedPaths: ['/b.mp3'],
            loopMode: LoopMode.All,
            isShuffled: true,
        };
        stored.set(session.playlistPath, session);
        const service: PlaylistSessionService = createService();

        await service.resumeSessionAsync(playlist);

        dialogServiceMock.verify((x) => x.showInfoDialog('changed'), Times.once());
        expect(playedByPlaybackService).toEqual(['/a.mp3']);
        expect(loopMode).toBe(LoopMode.None);
        expect(isShuffled).toBe(false);
        expect(storedSessions().every((x) => x.playedPaths.length === 1 && x.playedPaths[0] === '/a.mp3')).toBe(true);
    });

    it('should remove sessions whose playlist file no longer exists', () => {
        stored.set('/playlists/gone.m3u', {
            playlistPath: '/playlists/gone.m3u',
            trackPaths: ['/a.mp3'],
            playbackOrder: ['/a.mp3'],
            playedPaths: [],
            loopMode: LoopMode.None,
            isShuffled: false,
        });
        fileAccessMock.reset();
        fileAccessMock.setup((x) => x.pathExists('/playlists/gone.m3u')).returns(() => false);
        fileAccessMock.setup((x) => x.pathExists('/playlists')).returns(() => true);
        fileAccessMock.setup((x) => x.getDirectoryPath(It.isAny())).returns(() => '/playlists');
        const service: PlaylistSessionService = createService();

        expect(service.hasSession('/playlists/gone.m3u')).toBe(false);
        expect(stored.size).toBe(0);
    });

    it('should keep sessions when the playlist folder is not reachable', () => {
        stored.set('/playlists/p.m3u', {
            playlistPath: '/playlists/p.m3u',
            trackPaths: ['/a.mp3'],
            playbackOrder: ['/a.mp3'],
            playedPaths: [],
            loopMode: LoopMode.None,
            isShuffled: false,
        });
        fileAccessMock.reset();
        fileAccessMock.setup((x) => x.pathExists(It.isAny())).returns(() => false);
        fileAccessMock.setup((x) => x.getDirectoryPath(It.isAny())).returns(() => '/playlists');
        const service: PlaylistSessionService = createService();

        expect(service.hasSession('/playlists/p.m3u')).toBe(true);
    });

    it('should adopt a stored session when the restored queue matches it', () => {
        const session: PlaylistSession = {
            playlistPath: playlist.path,
            trackPaths: ['/a.mp3', '/b.mp3'],
            playbackOrder: ['/a.mp3', '/b.mp3'],
            playedPaths: ['/a.mp3'],
            loopMode: LoopMode.None,
            isShuffled: false,
        };
        stored.set(session.playlistPath, session);
        createService();
        queue.restoreTracks([createTrackModel('/a.mp3'), createTrackModel('/b.mp3')], [0, 1]);
        playbackStarted.next(new PlaybackStarted(queue.tracks[1], false));

        // Playing the last unplayed track of the adopted session completes it
        expect(storedSessions().length).toBe(0);
    });
});
