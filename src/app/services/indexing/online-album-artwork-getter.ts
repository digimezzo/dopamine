import { LastfmAlbum } from '../../core/api/lastfm/lastfm-album';
import { LastfmApi } from '../../core/api/lastfm/lastfm-api';
import { ImageProcessor } from '../../core/image-processor';
import { Logger } from '../../core/logger';
import { StringCompare } from '../../core/string-compare';
import { FileMetadata } from '../../metadata/file-metadata';

export class OnlineAlbumArtworkGetter {
    constructor(
        private imageprocessor: ImageProcessor,
        private lastfmApi: LastfmApi,
        private logger: Logger) {
    }

    public async getOnlineArtworkAsync(fileMetadata: FileMetadata): Promise<Buffer> {
        if (fileMetadata == undefined) {
            return undefined;
        }

        let title: string = '';
        const artists: string[] = [];

        // Title
        if (!StringCompare.isNullOrWhiteSpace(fileMetadata.album)) {
            title = fileMetadata.album;
        } else if (!StringCompare.isNullOrWhiteSpace(fileMetadata.title)) {
            title = fileMetadata.title;
        }

        // Artist
        if (fileMetadata.albumArtists != undefined && fileMetadata.albumArtists.length > 0) {
            const nonWhiteSpaceAlbumArtists: string[] = fileMetadata.albumArtists.filter(x => !StringCompare.isNullOrWhiteSpace(x));
            artists.push(...nonWhiteSpaceAlbumArtists);
        }

        if (fileMetadata.artists != undefined && fileMetadata.artists.length > 0) {
            const nonWhiteSpaceTrackArtists: string[] = fileMetadata.artists.filter(x => !StringCompare.isNullOrWhiteSpace(x));
            artists.push(...nonWhiteSpaceTrackArtists);
        }

        if (StringCompare.isNullOrWhiteSpace(title) || artists.length === 0) {
            return undefined;
        }

        for (const artist of artists) {
            let lastfmAlbum: LastfmAlbum;

            try {
                lastfmAlbum = await this.lastfmApi.getAlbumInfoAsync(artist, title, false, 'EN');
            } catch (e) {
                this.logger.error(
                    `Could not get album info for artist='${artist}' and title='${title}'. Error: ${e.message}`,
                    'OnlineAlbumArtworkGetter',
                    'getOnlineArtworkAsync');
            }

            if (lastfmAlbum != undefined) {
                if (!StringCompare.isNullOrWhiteSpace(lastfmAlbum.largestImage())) {
                    let artworkData: Buffer;

                    try {
                        artworkData = await this.imageprocessor.convertFileToDataAsync(lastfmAlbum.largestImage());

                        return artworkData;
                    } catch (e) {
                        this.logger.error(
                            `Could not convert file '${lastfmAlbum.largestImage()}' to data. Error: ${e.message}`,
                            'OnlineAlbumArtworkGetter',
                            'getOnlineArtworkAsync');
                    }
                }
            }
        }

        return undefined;
    }
}
