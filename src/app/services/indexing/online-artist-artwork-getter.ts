import { Injectable } from '@angular/core';
import { StringUtils } from '../../common/utils/string-utils';
import { LastfmArtist } from '../../common/api/lastfm/lastfm-artist';
import { Logger } from '../../common/logger';
import { ImageProcessor } from '../../common/image-processor';
import { LastfmApi } from '../../common/api/lastfm/lastfm.api';
import { Constants } from '../../common/application/constants';
import { MusicBrainzApi } from '../../common/api/musicbrainz/musicbrainz.api';
import { ArrayUtils } from '../../common/utils/array-utils';
import { FanartApi } from '../../common/api/fanart/fanart.api';

@Injectable()
export class OnlineArtistArtworkGetter {
    public constructor(
        private fanartApi: FanartApi,
        private imageProcessor: ImageProcessor,
        private lastfmApi: LastfmApi,
        private musicBrainzApi: MusicBrainzApi,
        private logger: Logger,
    ) {}

    public async getOnlineArtworkAsync(artistName: string): Promise<Buffer | undefined> {
        try {
            const artistImageUrls: string[] | undefined = await this.getAllOnlineArtworkUrlsAsync(artistName);
            if (artistImageUrls !== undefined) {
                const firstImageUrl = artistImageUrls[0];
                if (StringUtils.isNullOrWhiteSpace(firstImageUrl)) {
                    return Constants.emptyImageBuffer;
                } else {
                    return await this.downloadImageAsync(artistName, firstImageUrl);
                }
            }
        } catch (error) {
            this.logger.error(
                error,
                `Could not get artist image for '${artistName}'`,
                'OnlineArtistArtworkGetter',
                'getOnlineArtworkAsync',
            );
        }
    }

    public async getAllOnlineArtworkUrlsAsync(artistName: string): Promise<string[] | undefined> {
        try {
            let artistImageUrls: string[];
            const lastfmArtist: LastfmArtist = await this.getLastFmArtistAsync(artistName);
            artistImageUrls = await this.getAllImageUrlsByMusicBrainzIdAsync(artistName, lastfmArtist.musicBrainzId);
            if (!ArrayUtils.isNullOrEmpty(artistImageUrls)) {
                return artistImageUrls;
            }

            // fallback to MusicBrainz API
            const musicBrainzId: string = await this.musicBrainzApi.getMusicBrainzIdAsync(artistName);
            artistImageUrls = await this.getAllImageUrlsByMusicBrainzIdAsync(artistName, musicBrainzId);
            if (!ArrayUtils.isNullOrEmpty(artistImageUrls)) {
                return artistImageUrls;
            }

            this.logger.info(
                `Could not find online artwork for '${artistName}'`,
                'OnlineArtistArtworkGetter',
                'getAllOnlineArtworkUrlsAsync',
            );
            return [];
        } catch (error) {
            this.logger.error(
                error,
                `Could not get artist images for '${artistName}'`,
                'OnlineArtistArtworkGetter',
                'getAllOnlineArtworkUrlsAsync',
            );
        }
    }

    private async getLastFmArtistAsync(artistName: string): Promise<LastfmArtist> {
        try {
            return await this.lastfmApi.getArtistInfoAsync(artistName, false, 'EN');
        } catch (error: unknown) {
            this.logger.error(error, `Could not get artist info for '${artistName}'`, 'OnlineArtistArtworkGetter', 'getLastFmArtistAsync');
            throw error;
        }
    }

    private async getAllImageUrlsByMusicBrainzIdAsync(artistName: string, musicBrainzId: string): Promise<string[]> {
        if (!StringUtils.isNullOrWhiteSpace(musicBrainzId)) {
            try {
                return await this.fanartApi.getAllArtistThumbnailsAsync(musicBrainzId);
            } catch (error: unknown) {
                this.logger.error(
                    error,
                    `Could not get artist image URL for '${artistName}'`,
                    'OnlineArtistArtworkGetter',
                    'getAllImageUrlsByMusicBrainzIdAsync',
                );
                throw error;
            }
        }

        return [];
    }

    private async downloadImageAsync(artistName: string, imageUrl: string): Promise<Buffer | undefined> {
        try {
            const artworkData: Buffer = await this.imageProcessor.convertOnlineImageToBufferAsync(imageUrl);
            this.logger.info(`Downloaded online artwork for '${artistName}'`, 'ArtistArtworkGetter', 'downloadImageAsync');
            return artworkData;
        } catch (error: unknown) {
            this.logger.error(error, `Could not convert file '${imageUrl}' to data`, 'OnlineArtistArtworkGetter', 'downloadImageAsync');
            throw error;
        }
    }
}
