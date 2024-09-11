import { Injectable } from '@angular/core';
import { StringUtils } from '../common/utils/string-utils';
import { DataDelimiter } from './data-delimiter';

@Injectable()
export class AlbumKeyGenerator {
    public generateAlbumKey(albumTitle: string | undefined, albumArtists: string[] | undefined): string {
        if (!StringUtils.isNullOrWhiteSpace(albumTitle)) {
            const albumKeyItems: string[] = [];
            albumKeyItems.push(albumTitle!);

            if (albumArtists != undefined && albumArtists.length > 0) {
                albumKeyItems.push(...albumArtists.map((x) => x.toLowerCase()));
            }

            return DataDelimiter.toDelimitedString(albumKeyItems);
        }

        return '';
    }

    public generateAlbumKey2(albumTitle: string): string {
        if (albumTitle !== undefined && albumTitle.length > 0) {
            const albumKeyItems: string[] = [];
            albumKeyItems.push(albumTitle);

            return DataDelimiter.toDelimitedString(albumKeyItems);
        }

        return '';
    }

    public generateAlbumKey3(folder: string): string {
        if (folder !== undefined && folder.length > 0) {
            const albumKeyItems: string[] = [];
            albumKeyItems.push(folder);

            return DataDelimiter.toDelimitedString(albumKeyItems);
        }

        return '';
    }
}
