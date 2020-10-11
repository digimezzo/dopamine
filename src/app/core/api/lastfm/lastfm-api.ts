import { Md5 } from 'md5-typescript';
import fetch from 'node-fetch';
import { SensitiveInformation } from '../../base/sensitive-information';
import { DateTime } from '../../date-time';
import { StringComparison } from '../../string-comparison';
import { LastfmAlbum } from './lastfm-album';
import { LastfmArtist } from './lastfm-artist';
import { LastfmBiography } from './lastfm-biography';

export class LastfmApi {
    public static async getMobileSessionAsync(username: string, password: string): Promise<string> {
        const method: string = 'auth.getMobileSession';
        const parameters: Map<string, string> = new Map<string, string>([
            ['username', username],
            ['password', password],
            ['api_key', SensitiveInformation.lastfmApiKey],
        ]);

        const methodSignature: string = LastfmApi.generateMethodSignature(method, parameters);
        parameters.set('api_sig', methodSignature);

        const jsonResponse: any = await LastfmApi.performPostRequestAsync(method, parameters, true);

        if (jsonResponse) {
            return jsonResponse.session.key;
        }

        return '';
    }

    public static async getArtistInfoAsync(artist: string, autoCorrect: boolean, languageCode: string): Promise<LastfmArtist> {
        const method: string = 'artist.getInfo';
        const parameters: Map<string, string> = new Map<string, string>([
            ['artist', artist],
            ['autocorrect', autoCorrect ? '1' : '0'],
            ['api_key', SensitiveInformation.lastfmApiKey],
        ]);

        if (!StringComparison.isNullOrWhiteSpace(languageCode)) {
            parameters.set('lang', languageCode);
        }

        const jsonResponse: any = await LastfmApi.performGetRequestAsync(method, parameters, false);
        const lastfmArtist: LastfmArtist = new LastfmArtist();

        if (jsonResponse) {
            // http://www.last.fm/api/show/artist.getInfo
            const artistImages: any[] = jsonResponse.artist.image;

            lastfmArtist.name = jsonResponse.artist.name;
            lastfmArtist.musicBrainzId = jsonResponse.artist.mbid;
            lastfmArtist.url = jsonResponse.artist.url;
            lastfmArtist.imageSmall = LastfmApi.getArtistImageOfSpecifiedSize(artistImages, 'small');
            lastfmArtist.imageMedium = LastfmApi.getArtistImageOfSpecifiedSize(artistImages, 'medium');
            lastfmArtist.imageLarge = LastfmApi.getArtistImageOfSpecifiedSize(artistImages, 'large');
            lastfmArtist.imageExtraLarge = LastfmApi.getArtistImageOfSpecifiedSize(artistImages, 'extralarge');
            lastfmArtist.imageMega = LastfmApi.getArtistImageOfSpecifiedSize(artistImages, 'mega');

            for (let i = 0; i < jsonResponse.artist.similar.artist.length; i++) {
                const similarArtistImages: any[] = jsonResponse.artist.similar.artist[i].image;
                const similarLastfmArtist: LastfmArtist = new LastfmArtist();

                similarLastfmArtist.name = jsonResponse.artist.similar.artist[i].name;
                similarLastfmArtist.url = jsonResponse.artist.similar.artist[i].url;
                similarLastfmArtist.imageSmall = LastfmApi.getArtistImageOfSpecifiedSize(similarArtistImages, 'small');
                similarLastfmArtist.imageMedium = LastfmApi.getArtistImageOfSpecifiedSize(similarArtistImages, 'medium');
                similarLastfmArtist.imageLarge = LastfmApi.getArtistImageOfSpecifiedSize(similarArtistImages, 'large');
                similarLastfmArtist.imageExtraLarge = LastfmApi.getArtistImageOfSpecifiedSize(similarArtistImages, 'extralarge');
                similarLastfmArtist.imageMega = LastfmApi.getArtistImageOfSpecifiedSize(similarArtistImages, 'mega');

                lastfmArtist.similarArtists.push(similarLastfmArtist);
            }

            const lastfmBiography: LastfmBiography = new LastfmBiography();
            lastfmBiography.published = jsonResponse.artist.bio.published;
            lastfmBiography.summary = jsonResponse.artist.bio.summary;
            lastfmBiography.content = jsonResponse.artist.bio.content;

            lastfmArtist.biography = lastfmBiography;
        }

        return lastfmArtist;
    }

    public static async getAlbumInfoAsync(artist: string, album: string, autoCorrect: boolean, languageCode: string): Promise<LastfmAlbum> {
        const method: string = 'album.getInfo';
        const parameters: Map<string, string> = new Map<string, string>([
            ['artist', artist],
            ['album', album],
            ['autocorrect', autoCorrect ? '1' : '0'],
            ['api_key', SensitiveInformation.lastfmApiKey],
        ]);

        if (!StringComparison.isNullOrWhiteSpace(languageCode)) {
            parameters.set('lang', languageCode);
        }

        const jsonResponse: any = await LastfmApi.performGetRequestAsync(method, parameters, false);
        const lastfmAlbum: LastfmAlbum = new LastfmAlbum();

        if (jsonResponse) {
            // http://www.last.fm/api/show/album.getInfo
            lastfmAlbum.artist = jsonResponse.album.artist;
            lastfmAlbum.name = jsonResponse.album.name;
            lastfmAlbum.url = jsonResponse.album.url;
            lastfmAlbum.imageSmall = LastfmApi.getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'small');
            lastfmAlbum.imageMedium = LastfmApi.getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'medium');
            lastfmAlbum.imageLarge = LastfmApi.getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'large');
            lastfmAlbum.imageExtraLarge = LastfmApi.getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'extralarge');
            lastfmAlbum.imageMega = LastfmApi.getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'mega');
        }

        return lastfmAlbum;
    }

    public static async ScrobbleTrackAsync(
        sessionKey: string,
        artist: string,
        trackTitle: string,
        albumTitle: string,
        playbackStartTime: Date): Promise<boolean> {
        let isScrobbleSuccessful: boolean = false;

        const method: string = 'track.scrobble';

        const parameters: Map<string, string> = new Map<string, string>([
            ['artist', artist],
            ['track', trackTitle],
            ['timestamp', DateTime.convertToUnixTime(playbackStartTime).toString()],
            ['api_key', SensitiveInformation.lastfmApiKey],
            ['sk', sessionKey],
        ]);

        if (!StringComparison.isNullOrWhiteSpace(albumTitle)) {
            parameters.set('album', albumTitle);
        }

        const methodSignature: string = LastfmApi.generateMethodSignature(method, parameters);
        parameters.set('api_sig', methodSignature);

        const jsonResponse: any = await LastfmApi.performPostRequestAsync(method, parameters, false);

        if (jsonResponse) {
            isScrobbleSuccessful = true;
        }

        return isScrobbleSuccessful;
    }

    public static async UpdateTrackNowPlayingAsync(
        sessionKey: string,
        artist: string,
        trackTitle: string,
        albumTitle: string): Promise<boolean> {
        let isNowPlayingUpdateSuccessful: boolean = false;

        const method: string = 'track.updateNowPlaying';

        const parameters: Map<string, string> = new Map<string, string>([
            ['artist', artist],
            ['track', trackTitle],
            ['api_key', SensitiveInformation.lastfmApiKey],
            ['sk', sessionKey],
        ]);

        if (!StringComparison.isNullOrWhiteSpace(albumTitle)) {
            parameters.set('album', albumTitle);
        }

        const methodSignature: string = LastfmApi.generateMethodSignature(method, parameters);
        parameters.set('api_sig', methodSignature);

        const jsonResponse: any = await LastfmApi.performPostRequestAsync(method, parameters, false);

        if (jsonResponse) {
            isNowPlayingUpdateSuccessful = true;
        }

        return isNowPlayingUpdateSuccessful;
    }

    public static async LoveTrackAsync(
        sessionKey: string,
        artist: string,
        trackTitle: string): Promise<boolean> {
        let isLoveTrackSuccessful: boolean = false;

        const method: string = 'track.love';

        const parameters: Map<string, string> = new Map<string, string>([
            ['artist', artist],
            ['track', trackTitle],
            ['api_key', SensitiveInformation.lastfmApiKey],
            ['sk', sessionKey],
        ]);

        const methodSignature: string = LastfmApi.generateMethodSignature(method, parameters);
        parameters.set('api_sig', methodSignature);

        const jsonResponse: any = await LastfmApi.performPostRequestAsync(method, parameters, false);

        if (jsonResponse) {
            isLoveTrackSuccessful = true;
        }

        return isLoveTrackSuccessful;
    }

    public static async UnloveTrackAsync(
        sessionKey: string,
        artist: string,
        trackTitle: string): Promise<boolean> {
        let isLoveTrackSuccessful: boolean = false;

        const method: string = 'track.unlove';

        const parameters: Map<string, string> = new Map<string, string>([
            ['artist', artist],
            ['track', trackTitle],
            ['api_key', SensitiveInformation.lastfmApiKey],
            ['sk', sessionKey],
        ]);

        const methodSignature: string = LastfmApi.generateMethodSignature(method, parameters);
        parameters.set('api_sig', methodSignature);

        const jsonResponse: any = await LastfmApi.performPostRequestAsync(method, parameters, false);

        if (jsonResponse) {
            isLoveTrackSuccessful = true;
        }

        return isLoveTrackSuccessful;
    }


    private static async getMethodUrl(method: String, isSecure: boolean): Promise<string> {
        return `${isSecure ? 'https' : 'http'}://ws.audioscrobbler.com/2.0/?method=${method}`;
    }

    private static async performGetRequestAsync(method: string, parameters: Map<string, string>, isSecure: boolean): Promise<any> {
        const searchParams: URLSearchParams = new URLSearchParams();
        parameters.forEach((value: string, key: string) => {
            searchParams.append(key, value);
            searchParams.append('format', 'json');
        });

        const url: string = `${await LastfmApi.getMethodUrl(method, isSecure)}&${searchParams.toString()}`;
        const response: Response = await fetch(url, { method: 'GET' });

        if (response.ok) {
            const jsonResponse: any = await response.json();

            return jsonResponse;
        }

        return null;
    }

    private static async performPostRequestAsync(method: string, parameters: Map<string, string>, isSecure: boolean): Promise<any> {
        const url: string = `${await LastfmApi.getMethodUrl(method, isSecure)}`;

        const searchParams: URLSearchParams = new URLSearchParams();
        parameters.forEach((value: string, key: string) => {
            searchParams.append(key, value);
            searchParams.append('format', 'json');
        });

        const response: Response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: searchParams
        });

        if (response.ok) {
            const jsonResponse: any = await response.json();

            return jsonResponse;
        }

        return null;
    }

    private static getArtistImageOfSpecifiedSize(images: any[], imageSize: string): string {
        for (let i = 0; i < images.length; i++) {
            const size: string = images[i].size;

            if (size === imageSize) {
                return images[i]['#text'];
            }
        }

        return '';
    }

    private static generateMethodSignature(method: string, parameters: Map<string, string>): string {
        let alphabeticalList: string[] = [];

        parameters.forEach((value: string, key: string) => {
            alphabeticalList.push(`${key}${value}`);
        });

        alphabeticalList.push(`method${method}`);

        alphabeticalList = alphabeticalList.sort();

        const unEncryptedSignature: string = `${alphabeticalList.join('')}${SensitiveInformation.lastfmSharedSecret}`;
        const encryptedSignature: string = Md5.init(unEncryptedSignature);

        return encryptedSignature;
    }
}
