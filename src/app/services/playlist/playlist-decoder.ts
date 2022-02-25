import { Injectable } from '@angular/core';
import { FileFormats } from '../../common/application/file-formats';
import { FileSystem } from '../../common/io/file-system';
import { Strings } from '../../common/strings';
import { PlaylistEntry } from './playlist-entry';
import { PlaylistModel } from './playlist-model';

@Injectable()
export class PlaylistDecoder {
    constructor(private fileSystem: FileSystem) {}

    public async decodePlaylistAsync(playlist: PlaylistModel): Promise<PlaylistEntry[]> {
        let playlistEntries: PlaylistEntry[] = [];

        if (
            this.fileSystem.getFileExtension(playlist.path) === FileFormats.m3u ||
            this.fileSystem.getFileExtension(playlist.path) === FileFormats.m3u8
        ) {
            playlistEntries = await this.decodeM3uPlaylistAsync(playlist);
        }

        return playlistEntries;
    }

    private async decodeM3uPlaylistAsync(playlist: PlaylistModel): Promise<PlaylistEntry[]> {
        const playlistEntries: PlaylistEntry[] = [];
        const fileLines: string[] = await this.fileSystem.readLinesAsync(playlist.path);

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
