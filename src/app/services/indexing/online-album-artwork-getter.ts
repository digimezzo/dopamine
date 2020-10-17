import { LastfmAlbum } from '../../core/api/lastfm/lastfm-album';
import { LastfmApi } from '../../core/api/lastfm/lastfm-api';
import { ImageProcessor } from '../../core/image-processor';
import { Logger } from '../../core/logger';
import { Strings } from '../../core/strings';
import { FileMetadata } from '../../metadata/file-metadata';

export class OnlineAlbumArtworkGetter {
    constructor(
        private imageprocessor: ImageProcessor,
        private lastfmApi: LastfmApi,
        private logger: Logger) {
    }

    public async getOnlineArtworkAsync(fileMetadata: FileMetadata): Promise<Buffer> {
        if (fileMetadata === null) {
            return null;
        }

        if (fileMetadata === undefined) {
            return null;
        }

        let title: string = '';
        const artists: string[] = [];

        // Title
        if (!Strings.isNullOrWhiteSpace(fileMetadata.album)) {
            title = fileMetadata.album;
        } else if (!Strings.isNullOrWhiteSpace(fileMetadata.title)) {
            title = fileMetadata.title;
        }

        // Artist
        if (fileMetadata.albumArtists !== null && fileMetadata.albumArtists !== undefined && fileMetadata.albumArtists.length > 0) {
            const nonWhiteSpaceAlbumArtists: string[] = fileMetadata.albumArtists.filter(x => !Strings.isNullOrWhiteSpace(x));
            artists.push(...nonWhiteSpaceAlbumArtists);
        }

        if (fileMetadata.artists !== null && fileMetadata.artists !== undefined && fileMetadata.artists.length > 0) {
            const nonWhiteSpaceTrackArtists: string[] = fileMetadata.artists.filter(x => !Strings.isNullOrWhiteSpace(x));
            artists.push(...nonWhiteSpaceTrackArtists);
        }

        if (Strings.isNullOrWhiteSpace(title) || artists.length === 0) {
            return null;
        }

        for (const artist of artists) {
            let lastfmAlbum: LastfmAlbum = null;

            try {
                lastfmAlbum = await this.lastfmApi.getAlbumInfoAsync(artist, title, false, 'EN');
            } catch (e) {
                this.logger.error(
                    `Could not get album info for artist='${artist}' and title='${title}'. Error: ${e.message}`,
                    'OnlineAlbumArtworkGetter',
                    'getOnlineArtworkAsync');
            }

            if (lastfmAlbum !== null && lastfmAlbum !== undefined) {
                if (!Strings.isNullOrWhiteSpace(lastfmAlbum.largestImage())) {
                    let artworkData: Buffer = null;

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

        return null;
    }
}
