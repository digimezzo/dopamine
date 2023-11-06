import { Injectable } from '@angular/core';
import { FileFormats } from '../../common/application/file-formats';
import { StringUtils } from '../../common/utils/string-utils';
import { PlaylistEntry } from './playlist-entry';
import { FileAccessBase } from '../../common/io/file-access.base';

@Injectable()
export class PlaylistDecoder {
    public constructor(private fileAccess: FileAccessBase) {}

    public async decodePlaylistAsync(playlistPath: string): Promise<PlaylistEntry[]> {
        let playlistEntries: PlaylistEntry[] = [];

        if (
            this.fileAccess.getFileExtension(playlistPath) === FileFormats.m3u ||
            this.fileAccess.getFileExtension(playlistPath) === FileFormats.m3u8
        ) {
            playlistEntries = await this.decodeM3uPlaylistAsync(playlistPath);
        }

        return playlistEntries;
    }

    private async decodeM3uPlaylistAsync(playlistPath: string): Promise<PlaylistEntry[]> {
        const playlistEntries: PlaylistEntry[] = [];
        const fileLines: string[] = await this.fileAccess.readLinesAsync(playlistPath);

        for (const fileLine of fileLines) {
            // We don't process empty lines and lines containing comments
            if (!StringUtils.isNullOrWhiteSpace(fileLine) && !fileLine.startsWith('#')) {
                const fullTrackPath: string = this.ensureFullTrackPath(playlistPath, fileLine);

                if (!StringUtils.isNullOrWhiteSpace(fullTrackPath)) {
                    playlistEntries.push(new PlaylistEntry(fileLine, fullTrackPath));
                }
            }
        }

        return playlistEntries;
    }

    private ensureFullTrackPath(playlistPath: string, trackPath: string): string {
        let fullTrackPath: string = '';
        const playlistDirectory: string = this.fileAccess.getDirectoryOrFileName(playlistPath);

        if (this.fileAccess.isAbsolutePath(trackPath)) {
            fullTrackPath = trackPath;
        } else {
            fullTrackPath = this.fileAccess.generateFullPath(playlistDirectory, trackPath);
        }

        return fullTrackPath;
    }
}
