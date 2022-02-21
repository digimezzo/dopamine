import { FileFormats } from '../../common/application/file-formats';
import { FileSystem } from '../../common/io/file-system';
import { Strings } from '../../common/strings';
import { PlaylistEntry } from './playlist-entry';
import { PlaylistModel } from './playlist-model';

export class PlaylistDecoder {
    constructor(private fileSystem: FileSystem) {}

    public decodePlaylist(playlist: PlaylistModel): PlaylistEntry[] {
        let playlistEntries: PlaylistEntry[] = [];

        if (
            this.fileSystem.getFileExtension(playlist.path) === FileFormats.m3u ||
            this.fileSystem.getFileExtension(playlist.path) === FileFormats.m3u8
        ) {
            playlistEntries = this.decodeM3uPlaylist(playlist);
        }

        return playlistEntries;
    }

    private decodeM3uPlaylist(playlist: PlaylistModel): PlaylistEntry[] {
        const playlistEntries: PlaylistEntry[] = [];
        const fileLines: string[] = this.fileSystem.readLines(playlist.path);

        for (const fileLine of fileLines) {
            // We don't process empty lines and lines containing comments
            if (!Strings.isNullOrWhiteSpace(fileLine) && !fileLine.startsWith('#')) {
                const fullTrackPath: string = this.ensureFullTrackPath(playlist.path, fileLine);

                if (!Strings.isNullOrWhiteSpace(fullTrackPath)) {
                    playlistEntries.push(new PlaylistEntry(fileLine, fullTrackPath));
                }
            }
        }

        return playlistEntries;
    }

    private ensureFullTrackPath(playlistPath: string, trackPath: string): string {
        let fullTrackPath: string = '';
        const playlistDirectory: string = this.fileSystem.getDirectoryOrFileName(playlistPath);

        if (this.fileSystem.isAbsolutePath(trackPath)) {
            fullTrackPath = trackPath;
        } else {
            fullTrackPath = this.fileSystem.generateFullPath(playlistDirectory, trackPath);
        }

        return fullTrackPath;
    }
}
