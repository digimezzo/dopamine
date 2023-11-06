import { Injectable } from '@angular/core';
import { LastfmAlbum } from '../../common/api/lastfm/lastfm-album';
import { LastfmApi } from '../../common/api/lastfm/lastfm.api';
import { ImageProcessor } from '../../common/image-processor';
import { Logger } from '../../common/logger';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { StringUtils } from '../../common/utils/string-utils';

@Injectable()
export class OnlineAlbumArtworkGetter {
    public constructor(
        private imageProcessor: ImageProcessor,
        private lastfmApi: LastfmApi,
        private logger: Logger,
    ) {}

    public async getOnlineArtworkAsync(fileMetadata: IFileMetadata | undefined): Promise<Buffer | undefined> {
        if (fileMetadata == undefined) {
            return undefined;
        }

        let title: string = '';
        const artists: string[] = [];

        // Title
        if (!StringUtils.isNullOrWhiteSpace(fileMetadata.album)) {
            title = fileMetadata.album;
        } else if (!StringUtils.isNullOrWhiteSpace(fileMetadata.title)) {
            title = fileMetadata.title;
        }

        // Artist
        if (fileMetadata.albumArtists != undefined && fileMetadata.albumArtists.length > 0) {
            const nonWhiteSpaceAlbumArtists: string[] = fileMetadata.albumArtists.filter((x) => !StringUtils.isNullOrWhiteSpace(x));
            artists.push(...nonWhiteSpaceAlbumArtists);
        }

        if (fileMetadata.artists != undefined && fileMetadata.artists.length > 0) {
            const nonWhiteSpaceTrackArtists: string[] = fileMetadata.artists.filter((x) => !StringUtils.isNullOrWhiteSpace(x));
            artists.push(...nonWhiteSpaceTrackArtists);
        }

        if (StringUtils.isNullOrWhiteSpace(title) || artists.length === 0) {
            return undefined;
        }

        for (const artist of artists) {
            let lastfmAlbum: LastfmAlbum | undefined;

            try {
                lastfmAlbum = await this.lastfmApi.getAlbumInfoAsync(artist, title, false, 'EN');
            } catch (e: unknown) {
                this.logger.error(
                    e,
                    `Could not get album info for artist='${artist}' and title='${title}'`,
                    'OnlineAlbumArtworkGetter',
                    'getOnlineArtworkAsync',
                );
            }

            if (lastfmAlbum != undefined) {
                if (!StringUtils.isNullOrWhiteSpace(lastfmAlbum.largestImage())) {
                    let artworkData: Buffer;

                    try {
                        artworkData = await this.imageProcessor.convertOnlineImageToBufferAsync(lastfmAlbum.largestImage());

                        this.logger.info(
                            `Downloaded online artwork for artist='${artist}' and title='${title}'`,
                            'OnlineAlbumArtworkGetter',
                            'getOnlineArtworkAsync',
                        );

                        return artworkData;
                    } catch (e: unknown) {
                        this.logger.error(
                            e,
                            `Could not convert file '${lastfmAlbum.largestImage()}' to data`,
                            'OnlineAlbumArtworkGetter',
                            'getOnlineArtworkAsync',
                        );
                    }
                }
            }
        }

        return undefined;
    }
}
