import { FileSystem } from '../../common/io/file-system';

export class PlaylistDecoder {
    constructor(private fileSystem: FileSystem) {}
    // private decodeM3uPlaylist(playlist: PlaylistModel): PlaylistEntry[] {}

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
