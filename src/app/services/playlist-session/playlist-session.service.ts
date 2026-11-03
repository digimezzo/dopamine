import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Logger } from '../../common/logger';
import { FileAccessBase } from '../../common/io/file-access.base';
import { PlaylistSessionRepositoryBase } from '../../data/repositories/playlist-session-repository.base';
import { DialogServiceBase } from '../dialog/dialog.service.base';
import { PlaybackService } from '../playback/playback.service';
import { PlaybackStarted } from '../playback/playback-started';
import { Queue } from '../playback/queue';
import { PlaylistModel } from '../playlist/playlist-model';
import { PlaylistServiceBase } from '../playlist/playlist.service.base';
import { TrackModel } from '../track/track-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { PlaylistSession } from './playlist-session';

interface PendingSession {
    session: PlaylistSession;
    queueTracksBefore: TrackModel[];
}

@Injectable({ providedIn: 'root' })
export class PlaylistSessionService {
    private sessions: Map<string, PlaylistSession> | undefined;
    private sessionsChanged: Subject<void> = new Subject();
    private activeSession: PlaylistSession | undefined;
    // The queue's track array is replaced whenever new tracks are enqueued, so a different reference means the session was left.
    private activeQueueTracks: TrackModel[] | undefined;
    private pendingSession: PendingSession | undefined;

    public constructor(
        private playbackService: PlaybackService,
        private playlistService: PlaylistServiceBase,
        private queue: Queue,
        private repository: PlaylistSessionRepositoryBase,
        private fileAccess: FileAccessBase,
        private dialogService: DialogServiceBase,
        private translatorService: TranslatorServiceBase,
        private logger: Logger,
    ) {
        this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
            this.onPlaybackStarted(playbackStarted.currentTrack);
        });
    }

    public sessionsChanged$: Observable<void> = this.sessionsChanged.asObservable();

    public hasSession(playlistPath: string): boolean {
        return this.getSessions().has(playlistPath);
    }

    public async enqueueAndPlayPlaylistAsync(playlist: PlaylistModel): Promise<void> {
        const tracks: TrackModel[] = (await this.playlistService.getTracksAsync([playlist])).tracks;

        if (tracks.length === 0) {
            return;
        }

        // Playing a playlist from its start always replaces its previous session.
        this.removeSession(playlist.path);
        await this.startNewSessionAsync(playlist, tracks);
    }

    public async resumeSessionAsync(playlist: PlaylistModel): Promise<void> {
        const tracks: TrackModel[] = (await this.playlistService.getTracksAsync([playlist])).tracks;

        if (tracks.length === 0) {
            return;
        }

        const session: PlaylistSession | undefined = this.getSessions().get(playlist.path);

        if (session == undefined) {
            await this.startNewSessionAsync(playlist, tracks);
            return;
        }

        if (!this.isSameTracks(session, tracks)) {
            this.removeSession(playlist.path);
            const message: string = await this.translatorService.getAsync('playlist-changed-since-last-session');
            this.dialogService.showInfoDialog(message);
            await this.startNewSessionAsync(playlist, tracks);
            return;
        }

        this.pendingSession = { session: { ...session, playedPaths: [...session.playedPaths] }, queueTracksBefore: this.queue.tracks };

        try {
            for (let i: number = 0; i < 3 && this.playbackService.loopMode !== session.loopMode; i++) {
                this.playbackService.toggleLoopMode();
            }

            if (this.playbackService.isShuffled !== session.isShuffled) {
                this.playbackService.toggleIsShuffled();
            }

            this.queue.setTracks(tracks, false);
            this.applyPlaybackOrder(session.playbackOrder);
            this.playbackService.saveQueue();

            const played: Set<string> = new Set(session.playedPaths);
            const queuedTracksInPlaybackOrder: TrackModel[] = this.queue.tracksInPlaybackOrder;
            const trackToPlay: TrackModel | undefined =
                queuedTracksInPlaybackOrder.find((x) => !played.has(x.path)) ?? queuedTracksInPlaybackOrder[0];

            if (trackToPlay != undefined) {
                await this.playbackService.playQueuedTrackAsync(trackToPlay);
            }
        } finally {
            this.pendingSession = undefined;
        }
    }

    private async startNewSessionAsync(playlist: PlaylistModel, tracks: TrackModel[]): Promise<void> {
        this.pendingSession = {
            session: {
                playlistPath: playlist.path,
                trackPaths: tracks.map((x) => x.path).sort(),
                playbackOrder: [],
                playedPaths: [],
                loopMode: this.playbackService.loopMode,
                isShuffled: this.playbackService.isShuffled,
            },
            queueTracksBefore: this.queue.tracks,
        };

        try {
            await this.playbackService.enqueueAndPlayTracksAsync(tracks);
        } finally {
            this.pendingSession = undefined;
        }
    }

    private onPlaybackStarted(track: TrackModel): void {
        const queueTracks: TrackModel[] = this.queue.tracks;

        if (this.pendingSession != undefined && queueTracks !== this.pendingSession.queueTracksBefore) {
            this.activeSession = this.pendingSession.session;
            this.activeQueueTracks = queueTracks;
            this.pendingSession = undefined;
        } else if (this.activeSession != undefined && queueTracks !== this.activeQueueTracks) {
            this.activeSession = undefined;
            this.activeQueueTracks = undefined;
        }

        if (this.activeSession == undefined && this.pendingSession == undefined) {
            this.tryAdoptSessionForRestoredQueue(queueTracks);
        }

        if (this.activeSession != undefined) {
            this.updateActiveSession(this.activeSession, track);
        }
    }

    // After an application restart, the restored queue continues the session that was active when the application was closed.
    private tryAdoptSessionForRestoredQueue(queueTracks: TrackModel[]): void {
        if (this.getSessions().size === 0) {
            return;
        }

        const queuePaths: string[] = queueTracks.map((x) => x.path).sort();

        for (const session of this.getSessions().values()) {
            if (this.areEqual(session.trackPaths, queuePaths)) {
                this.activeSession = session;
                this.activeQueueTracks = queueTracks;
                return;
            }
        }
    }

    private updateActiveSession(session: PlaylistSession, track: TrackModel): void {
        const trackPaths: Set<string> = new Set(session.trackPaths);

        if (!session.playedPaths.includes(track.path)) {
            session.playedPaths.push(track.path);
        }

        session.playbackOrder = this.queue.tracksInPlaybackOrder.map((x) => x.path).filter((x) => trackPaths.has(x));
        session.loopMode = this.playbackService.loopMode;
        session.isShuffled = this.playbackService.isShuffled;

        const played: Set<string> = new Set(session.playedPaths);

        if (session.trackPaths.every((x) => played.has(x))) {
            this.removeSession(session.playlistPath);
            return;
        }

        this.getSessions().set(session.playlistPath, session);
        this.saveSession(session);
    }

    private applyPlaybackOrder(playbackOrder: string[]): void {
        const queuedTracks: TrackModel[] = this.queue.tracks;
        const indicesByPath: Map<string, number[]> = new Map();

        queuedTracks.forEach((track: TrackModel, index: number) => {
            const indices: number[] = indicesByPath.get(track.path) ?? [];
            indices.push(index);
            indicesByPath.set(track.path, indices);
        });

        const desiredOrder: TrackModel[] = [];
        const used: Set<number> = new Set();

        for (const path of playbackOrder) {
            const index: number | undefined = indicesByPath.get(path)?.shift();

            if (index != undefined) {
                used.add(index);
                desiredOrder.push(queuedTracks[index]);
            }
        }

        queuedTracks.forEach((track: TrackModel, index: number) => {
            if (!used.has(index)) {
                desiredOrder.push(track);
            }
        });

        desiredOrder.forEach((track: TrackModel, position: number) => {
            this.queue.moveTrackInPlaybackOrder(this.queue.getPlaybackOrderIndex(track), position);
        });
    }

    private isSameTracks(session: PlaylistSession, tracks: TrackModel[]): boolean {
        return this.areEqual(session.trackPaths, tracks.map((x) => x.path).sort());
    }

    private areEqual(sortedPaths1: string[], sortedPaths2: string[]): boolean {
        return sortedPaths1.length === sortedPaths2.length && sortedPaths1.every((x, i) => x === sortedPaths2[i]);
    }

    private removeSession(playlistPath: string): void {
        if (this.activeSession?.playlistPath === playlistPath) {
            this.activeSession = undefined;
            this.activeQueueTracks = undefined;
        }

        if (this.getSessions().delete(playlistPath)) {
            try {
                this.repository.deleteSession(playlistPath);
            } catch (e: unknown) {
                this.logger.error(e, 'Could not delete playlist session', 'PlaylistSessionService', 'removeSession');
            }

            this.sessionsChanged.next();
        }
    }

    private getSessions(): Map<string, PlaylistSession> {
        if (this.sessions == undefined) {
            this.sessions = new Map();

            try {
                for (const session of this.repository.getSessions()) {
                    if (this.isOrphaned(session)) {
                        this.repository.deleteSession(session.playlistPath);
                    } else {
                        this.sessions.set(session.playlistPath, session);
                    }
                }
            } catch (e: unknown) {
                this.logger.error(e, 'Could not load playlist sessions', 'PlaylistSessionService', 'getSessions');
            }
        }

        return this.sessions;
    }

    // Playlists are files which can be deleted outside of the application. The session is only considered orphaned when
    // the playlist's folder is still reachable, so that e.g. an unmounted drive doesn't wipe the sessions.
    private isOrphaned(session: PlaylistSession): boolean {
        return (
            !this.fileAccess.pathExists(session.playlistPath) &&
            this.fileAccess.pathExists(this.fileAccess.getDirectoryPath(session.playlistPath))
        );
    }

    private saveSession(session: PlaylistSession): void {
        try {
            this.repository.saveSession(session);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not save playlist session', 'PlaylistSessionService', 'saveSession');
        }

        this.sessionsChanged.next();
    }
}
