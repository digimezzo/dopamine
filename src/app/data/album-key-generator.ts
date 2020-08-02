import { DataDelimiting } from './data-delimiting';

export class AlbumkeyGenerator {
    public static generateAlbumKey(albumTitle: string, albumArtists: string[]): string {
        if (albumTitle && albumTitle.trim() !== '') {
            const albumKeyItems: string[] = [];
            albumKeyItems.push(albumTitle);

            if (albumArtists && albumArtists.length > 0) {
                albumKeyItems.push(...albumArtists);
            }

            return DataDelimiting.convertToDelimitedString(albumKeyItems);
        }

        return '';
    }
}
