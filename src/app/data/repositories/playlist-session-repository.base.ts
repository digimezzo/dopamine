import { PlaylistSession } from '../../services/playlist-session/playlist-session';

export abstract class PlaylistSessionRepositoryBase {
    public abstract getSessions(): PlaylistSession[];
    public abstract saveSession(session: PlaylistSession): void;
    public abstract deleteSession(playlistPath: string): void;
}
