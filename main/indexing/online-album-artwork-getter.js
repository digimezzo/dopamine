const { StringUtils } = require('../common/utils/string-utils');
const { Logger } = require('../common/logger');
const { ImageProcessor } = require('../common/image-processor');
const { LastfmApi } = require('../common/api/lastfm.api');

class OnlineAlbumArtworkGetter {
    static async getOnlineArtworkAsync(fileMetadata) {
        if (fileMetadata === undefined || fileMetadata === null) {
            return undefined;
        }

        let title = '';
        const artists = [];

        // Title
        if (!StringUtils.isNullOrWhiteSpace(fileMetadata.album)) {
            title = fileMetadata.album;
        } else if (!StringUtils.isNullOrWhiteSpace(fileMetadata.title)) {
            title = fileMetadata.title;
        }

        // Artist
        if (fileMetadata.albumArtists !== undefined && fileMetadata.albumArtists !== null && fileMetadata.albumArtists.length > 0) {
            const nonWhiteSpaceAlbumArtists = fileMetadata.albumArtists.filter((x) => !StringUtils.isNullOrWhiteSpace(x));
            artists.push(...nonWhiteSpaceAlbumArtists);
        }

        if (fileMetadata.artists !== undefined && fileMetadata.artists !== null && fileMetadata.artists.length > 0) {
            const nonWhiteSpaceTrackArtists = fileMetadata.artists.filter((x) => !StringUtils.isNullOrWhiteSpace(x));
            artists.push(...nonWhiteSpaceTrackArtists);
        }

        if (StringUtils.isNullOrWhiteSpace(title) || artists.length === 0) {
            return undefined;
        }

        for (const artist of artists) {
            let lastfmAlbum;

            try {
                lastfmAlbum = await LastfmApi.getAlbumInfoAsync(artist, title, false, 'EN');
            } catch (e) {
                Logger.error(
                    e,
                    `Could not get album info for artist='${artist}' and title='${title}'`,
                    'OnlineAlbumArtworkGetter',
                    'getOnlineArtworkAsync',
                );
            }

            if (lastfmAlbum !== undefined && lastfmAlbum !== null) {
                if (!StringUtils.isNullOrWhiteSpace(lastfmAlbum.largestImage())) {
                    let artworkData;

                    try {
                        artworkData = await ImageProcessor.convertOnlineImageToBufferAsync(lastfmAlbum.largestImage());

                        Logger.info(
                            `Downloaded online artwork for artist='${artist}' and title='${title}'`,
                            'OnlineAlbumArtworkGetter',
                            'getOnlineArtworkAsync',
                        );

                        return artworkData;
                    } catch (e) {
                        Logger.error(
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

exports.OnlineAlbumArtworkGetter = OnlineAlbumArtworkGetter;
