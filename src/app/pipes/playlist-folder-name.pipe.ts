import { Pipe, PipeTransform } from '@angular/core';
import { FileSystem } from '../common/io/file-system';
import { Strings } from '../common/strings';
import { PlaylistFolderModel } from '../services/playlist/playlist-folder-model';

@Pipe({ name: 'playlistFolderName' })
export class PlaylistFolderNamePipe implements PipeTransform {
    constructor(private fileSystem: FileSystem) {}

    public transform(playlistFolder: PlaylistFolderModel): string {
        if (playlistFolder == undefined) {
            return '';
        }

        if (Strings.isNullOrWhiteSpace(playlistFolder.path)) {
            return '';
        }

        return this.fileSystem.getDirectoryName(playlistFolder.path);
    }
}
