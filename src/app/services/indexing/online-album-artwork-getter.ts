import { Injectable } from '@angular/core';
import { LastfmAlbum } from '../../common/api/lastfm/lastfm-album';
import { LastfmApi } from '../../common/api/lastfm/lastfm-api';
import { ImageProcessor } from '../../common/image-processor';
import { Logger } from '../../common/logger';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { Strings } from '../../common/strings';

@Injectable()
export class OnlineAlbumArtworkGetter {
    constructor(private imageprocessor: ImageProcessor, private lastfmApi: LastfmApi, private logger: Logger) {}

    public async getOnlineArtworkAsync(fileMetadata: IFileMetadata): Promise<Buffer> {
        if (fileMetadata == undefined) {
            return undefined;
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
        if (fileMetadata.albumArtists != undefined && fileMetadata.albumArtists.length > 0) {
            const nonWhiteSpaceAlbumArtists: string[] = fileMetadata.albumArtists.filter((x) => !Strings.isNullOrWhiteSpace(x));
            artists.push(...nonWhiteSpaceAlbumArtists);
        }

        if (fileMetadata.artists != undefined && fileMetadata.artists.length > 0) {
            const nonWhiteSpaceTrackArtists: string[] = fileMetadata.artists.filter((x) => !Strings.isNullOrWhiteSpace(x));
            artists.push(...nonWhiteSpaceTrackArtists);
        }

        if (Strings.isNullOrWhiteSpace(title) || artists.length === 0) {
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
                    'getOnlineArtworkAsync'
                );
            }

            if (lastfmAlbum != undefined) {
                if (!Strings.isNullOrWhiteSpace(lastfmAlbum.largestImage())) {
                    let artworkData: Buffer;

                    try {
                        artworkData = await this.imageprocessor.convertOnlineImageToBufferAsync(lastfmAlbum.largestImage());

                        this.logger.info(
                            `Downloaded online artwork for artist='${artist}' and title='${title}'`,
                            'OnlineAlbumArtworkGetter',
                            'getOnlineArtworkAsync'
                        );

                        return artworkData;
                    } catch (e) {
                        this.logger.error(
                            `Could not convert file '${lastfmAlbum.largestImage()}' to data. Error: ${e.message}`,
                            'OnlineAlbumArtworkGetter',
                            'getOnlineArtworkAsync'
                        );
                    }
                }
            }
        }

        return undefined;
    }
}
