import { LoopMode } from '../playback/loop-mode';

export interface PlaylistSession {
    playlistPath: string;
    // Sorted paths of the playlist's tracks when the session started. Used to detect playlist changes.
    trackPaths: string[];
    // Paths in playback order
    playbackOrder: string[];
    playedPaths: string[];
    loopMode: LoopMode;
    isShuffled: boolean;
}
