const { StringUtils } = require('../string-utils');
const { LastfmAlbum } = require('./lastfm-album');
const { SensitiveInformation } = require('../application/sensitive-information');

class LastfmApi {
    static async getAlbumInfoAsync(artist, album, autoCorrect, languageCode) {
        const method = 'album.getInfo';
        const parameters = [
            ['artist', artist],
            ['album', album],
            ['autocorrect', autoCorrect ? '1' : '0'],
            ['api_key', SensitiveInformation.lastfmApiKey],
        ];

        if (!StringUtils.isNullOrWhiteSpace(languageCode)) {
            parameters.set('lang', languageCode);
        }

        const jsonResponse = await this.#performGetRequestAsync(method, parameters, false);
        const lastfmAlbum = new LastfmAlbum();

        if (this.#isJsonResponseValid(jsonResponse)) {
            // http://www.last.fm/api/show/album.getInfo
            lastfmAlbum.artist = jsonResponse.album.artist;
            lastfmAlbum.name = jsonResponse.album.name;
            lastfmAlbum.url = jsonResponse.album.url;
            lastfmAlbum.imageSmall = this.#getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'small');
            lastfmAlbum.imageMedium = this.#getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'medium');
            lastfmAlbum.imageLarge = this.#getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'large');
            lastfmAlbum.imageExtraLarge = this.#getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'extralarge');
            lastfmAlbum.imageMega = this.#getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'mega');
        }

        return lastfmAlbum;
    }

    static #isJsonResponseValid(jsonResponse) {
        return jsonResponse !== undefined && jsonResponse !== null && (jsonResponse.error === undefined || jsonResponse.error === null);
    }

    static #getArtistImageOfSpecifiedSize(images, imageSize) {
        for (let i = 0; i < images.length; i++) {
            const size = images[i].size;

            if (size === imageSize) {
                return images[i]['#text'];
            }
        }

        return '';
    }

    static async #performGetRequestAsync(method, parameters, isSecure) {
        const searchParams = new URLSearchParams();
        parameters.forEach((value, key) => {
            searchParams.append(key, value);
            searchParams.append('format', 'json');
        });

        const url = `${await this.#getMethodUrl(method, isSecure)}&${searchParams.toString()}`;
        const response = await fetch(url, { method: 'GET' });

        if (response.ok) {
            return await response.json();
        }

        return undefined;
    }

    static async #getMethodUrl(method, isSecure) {
        return `${isSecure ? 'https' : 'http'}://ws.audioscrobbler.com/2.0/?method=${method}`;
    }
}

exports.LastfmApi = LastfmApi;
