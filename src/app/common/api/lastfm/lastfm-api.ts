import { Injectable } from '@angular/core';
import { Md5 } from 'md5-typescript';
import fetch from 'node-fetch';
import { SensitiveInformation } from '../../application/sensitive-information';
import { DateTime } from '../../date-time';
import { Strings } from '../../strings';
import { LastfmAlbum } from './lastfm-album';
import { LastfmArtist } from './lastfm-artist';
import { LastfmBiography } from './lastfm-biography';

@Injectable()
export class LastfmApi {
    public constructor(private dateTime: DateTime) {}

    public async getMobileSessionAsync(username: string, password: string): Promise<string> {
        const method: string = 'auth.getMobileSession';
        const parameters: Map<string, string> = new Map<string, string>([
            ['username', username],
            ['password', password],
            ['api_key', SensitiveInformation.lastfmApiKey],
        ]);

        const methodSignature: string = this.generateMethodSignature(method, parameters);
        parameters.set('api_sig', methodSignature);

        const jsonResponse: any = await this.performPostRequestAsync(method, parameters, true);

        if (this.isJsonResponseValid(jsonResponse)) {
            return jsonResponse.session.key;
        }

        return '';
    }

    public async getArtistInfoAsync(artist: string, autoCorrect: boolean, languageCode: string): Promise<LastfmArtist> {
        const method: string = 'artist.getInfo';
        const parameters: Map<string, string> = new Map<string, string>([
            ['artist', artist],
            ['autocorrect', autoCorrect ? '1' : '0'],
            ['api_key', SensitiveInformation.lastfmApiKey],
        ]);

        if (!Strings.isNullOrWhiteSpace(languageCode)) {
            parameters.set('lang', languageCode);
        }

        const jsonResponse: any = await this.performGetRequestAsync(method, parameters, false);
        const lastfmArtist: LastfmArtist = new LastfmArtist();

        if (this.isJsonResponseValid(jsonResponse)) {
            // http://www.last.fm/api/show/artist.getInfo
            const artistImages: any[] = jsonResponse.artist.image;

            lastfmArtist.name = jsonResponse.artist.name;
            lastfmArtist.musicBrainzId = jsonResponse.artist.mbid;
            lastfmArtist.url = jsonResponse.artist.url;
            lastfmArtist.imageSmall = this.getArtistImageOfSpecifiedSize(artistImages, 'small');
            lastfmArtist.imageMedium = this.getArtistImageOfSpecifiedSize(artistImages, 'medium');
            lastfmArtist.imageLarge = this.getArtistImageOfSpecifiedSize(artistImages, 'large');
            lastfmArtist.imageExtraLarge = this.getArtistImageOfSpecifiedSize(artistImages, 'extralarge');
            lastfmArtist.imageMega = this.getArtistImageOfSpecifiedSize(artistImages, 'mega');

            for (let i = 0; i < jsonResponse.artist.similar.artist.length; i++) {
                const similarArtistImages: any[] = jsonResponse.artist.similar.artist[i].image;
                const similarLastfmArtist: LastfmArtist = new LastfmArtist();

                similarLastfmArtist.name = jsonResponse.artist.similar.artist[i].name;
                similarLastfmArtist.url = jsonResponse.artist.similar.artist[i].url;
                similarLastfmArtist.imageSmall = this.getArtistImageOfSpecifiedSize(similarArtistImages, 'small');
                similarLastfmArtist.imageMedium = this.getArtistImageOfSpecifiedSize(similarArtistImages, 'medium');
                similarLastfmArtist.imageLarge = this.getArtistImageOfSpecifiedSize(similarArtistImages, 'large');
                similarLastfmArtist.imageExtraLarge = this.getArtistImageOfSpecifiedSize(similarArtistImages, 'extralarge');
                similarLastfmArtist.imageMega = this.getArtistImageOfSpecifiedSize(similarArtistImages, 'mega');

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

    public async getAlbumInfoAsync(artist: string, album: string, autoCorrect: boolean, languageCode: string): Promise<LastfmAlbum> {
        const method: string = 'album.getInfo';
        const parameters: Map<string, string> = new Map<string, string>([
            ['artist', artist],
            ['album', album],
            ['autocorrect', autoCorrect ? '1' : '0'],
            ['api_key', SensitiveInformation.lastfmApiKey],
        ]);

        if (!Strings.isNullOrWhiteSpace(languageCode)) {
            parameters.set('lang', languageCode);
        }

        const jsonResponse: any = await this.performGetRequestAsync(method, parameters, false);
        const lastfmAlbum: LastfmAlbum = new LastfmAlbum();

        if (this.isJsonResponseValid(jsonResponse)) {
            // http://www.last.fm/api/show/album.getInfo
            lastfmAlbum.artist = jsonResponse.album.artist;
            lastfmAlbum.name = jsonResponse.album.name;
            lastfmAlbum.url = jsonResponse.album.url;
            lastfmAlbum.imageSmall = this.getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'small');
            lastfmAlbum.imageMedium = this.getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'medium');
            lastfmAlbum.imageLarge = this.getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'large');
            lastfmAlbum.imageExtraLarge = this.getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'extralarge');
            lastfmAlbum.imageMega = this.getArtistImageOfSpecifiedSize(jsonResponse.album.image, 'mega');
        }

        return lastfmAlbum;
    }

    public async scrobbleTrackAsync(
        sessionKey: string,
        artist: string,
        trackTitle: string,
        albumTitle: string,
        playbackStartTime: Date
    ): Promise<boolean> {
        let isScrobbleSuccessful: boolean = false;

        const method: string = 'track.scrobble';

        const parameters: Map<string, string> = new Map<string, string>([
            ['artist', artist],
            ['track', trackTitle],
            ['timestamp', this.dateTime.convertDateToUnixTime(playbackStartTime).toString()],
            ['api_key', SensitiveInformation.lastfmApiKey],
            ['sk', sessionKey],
        ]);

        if (!Strings.isNullOrWhiteSpace(albumTitle)) {
            parameters.set('album', albumTitle);
        }

        const methodSignature: string = this.generateMethodSignature(method, parameters);
        parameters.set('api_sig', methodSignature);

        const jsonResponse: any = await this.performPostRequestAsync(method, parameters, false);

        if (this.isJsonResponseValid(jsonResponse)) {
            isScrobbleSuccessful = true;
        }

        return isScrobbleSuccessful;
    }

    public async updateTrackNowPlayingAsync(sessionKey: string, artist: string, trackTitle: string, albumTitle: string): Promise<boolean> {
        let isNowPlayingUpdateSuccessful: boolean = false;

        const method: string = 'track.updateNowPlaying';

        const parameters: Map<string, string> = new Map<string, string>([
            ['artist', artist],
            ['track', trackTitle],
            ['api_key', SensitiveInformation.lastfmApiKey],
            ['sk', sessionKey],
        ]);

        if (!Strings.isNullOrWhiteSpace(albumTitle)) {
            parameters.set('album', albumTitle);
        }

        const methodSignature: string = this.generateMethodSignature(method, parameters);
        parameters.set('api_sig', methodSignature);

        const jsonResponse: any = await this.performPostRequestAsync(method, parameters, false);

        if (this.isJsonResponseValid(jsonResponse)) {
            isNowPlayingUpdateSuccessful = true;
        }

        return isNowPlayingUpdateSuccessful;
    }

    public async loveTrackAsync(sessionKey: string, artist: string, trackTitle: string): Promise<boolean> {
        let isLoveTrackSuccessful: boolean = false;

        const method: string = 'track.love';

        const parameters: Map<string, string> = new Map<string, string>([
            ['artist', artist],
            ['track', trackTitle],
            ['api_key', SensitiveInformation.lastfmApiKey],
            ['sk', sessionKey],
        ]);

        const methodSignature: string = this.generateMethodSignature(method, parameters);
        parameters.set('api_sig', methodSignature);

        const jsonResponse: any = await this.performPostRequestAsync(method, parameters, false);

        if (this.isJsonResponseValid(jsonResponse)) {
            isLoveTrackSuccessful = true;
        }

        return isLoveTrackSuccessful;
    }

    public async unloveTrackAsync(sessionKey: string, artist: string, trackTitle: string): Promise<boolean> {
        let isLoveTrackSuccessful: boolean = false;

        const method: string = 'track.unlove';

        const parameters: Map<string, string> = new Map<string, string>([
            ['artist', artist],
            ['track', trackTitle],
            ['api_key', SensitiveInformation.lastfmApiKey],
            ['sk', sessionKey],
        ]);

        const methodSignature: string = this.generateMethodSignature(method, parameters);
        parameters.set('api_sig', methodSignature);

        const jsonResponse: any = await this.performPostRequestAsync(method, parameters, false);

        if (this.isJsonResponseValid(jsonResponse)) {
            isLoveTrackSuccessful = true;
        }

        return isLoveTrackSuccessful;
    }

    private async getMethodUrl(method: String, isSecure: boolean): Promise<string> {
        return `${isSecure ? 'https' : 'http'}://ws.audioscrobbler.com/2.0/?method=${method}`;
    }

    private async performGetRequestAsync(method: string, parameters: Map<string, string>, isSecure: boolean): Promise<any> {
        const searchParams: URLSearchParams = new URLSearchParams();
        parameters.forEach((value: string, key: string) => {
            searchParams.append(key, value);
            searchParams.append('format', 'json');
        });

        const url: string = `${await this.getMethodUrl(method, isSecure)}&${searchParams.toString()}`;
        const response: Response = await fetch(url, { method: 'GET' });

        if (response.ok) {
            const jsonResponse: any = await response.json();

            return jsonResponse;
        }

        return undefined;
    }

    private async performPostRequestAsync(method: string, parameters: Map<string, string>, isSecure: boolean): Promise<any> {
        const url: string = `${await this.getMethodUrl(method, isSecure)}`;

        const searchParams: URLSearchParams = new URLSearchParams();
        parameters.forEach((value: string, key: string) => {
            searchParams.append(key, value);
            searchParams.append('format', 'json');
        });

        const response: Response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: searchParams,
        });

        if (response.ok) {
            const jsonResponse: any = await response.json();

            return jsonResponse;
        }

        return undefined;
    }

    private getArtistImageOfSpecifiedSize(images: any[], imageSize: string): string {
        for (let i = 0; i < images.length; i++) {
            const size: string = images[i].size;

            if (size === imageSize) {
                return images[i]['#text'];
            }
        }

        return '';
    }

    private generateMethodSignature(method: string, parameters: Map<string, string>): string {
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

    private isJsonResponseValid(jsonResponse: any): boolean {
        return jsonResponse != undefined && jsonResponse.error == undefined;
    }
}
