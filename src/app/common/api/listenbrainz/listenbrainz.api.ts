import { Injectable } from '@angular/core';
import { DateTime } from '../../date-time';

@Injectable()
export class ListenbrainzApi {
    public constructor(private dateTime: DateTime) {}

    public async getUsernameByToken(token: string): Promise<string | undefined> {
        let username: string = '';

        const method: string = 'validate-token';
        const headers: any = {
            Authorization: `Token ${token}`,
        };
        const response: any = await this.performGetRequestAsync(method, headers);

        if (response !== undefined && response.valid === true) {
            username = response.user_name;
            return username;
        }
        return undefined;
    }

    public async updateNowPlayingAsync(token: string, artist: string, trackTitle: string, albumTitle: string): Promise<boolean> {
        let isUpdateSuccessful: boolean = false;

        const method: string = 'submit-listens';

        const headers: any = {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        };

        const trackMetadata: any = {
            artist_name: artist,
            track_name: trackTitle,
            release_name: albumTitle,
        };
        const requestBody: any = {
            listen_type: 'playing_now',
            payload: [
                {
                    track_metadata: trackMetadata,
                },
            ],
        };
        const response: any = await this.performPostRequestAsync(method, requestBody, headers);
        if (response !== undefined) {
            isUpdateSuccessful = true;
        }
        return isUpdateSuccessful;
    }

    public async scrobbleTrackAsync(
        token: string,
        artist: string,
        trackTitle: string,
        albumTitle: string,
        playbackStartTime: Date,
    ): Promise<boolean> {
        let isScrobbleSuccessful: boolean = false;

        const method: string = 'submit-listens';

        const headers: any = {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        };

        const trackMetadata: any = {
            artist_name: artist,
            track_name: trackTitle,
            release_name: albumTitle,
        };
        const listenedAt: number = this.dateTime.convertDateToUnixTime(playbackStartTime);

        const requestBody: any = {
            listen_type: 'single',
            payload: [
                {
                    listened_at: listenedAt,
                    track_metadata: trackMetadata,
                },
            ],
        };
        const response: any = await this.performPostRequestAsync(method, requestBody, headers);

        if (response !== undefined) {
            isScrobbleSuccessful = true;
        }

        return isScrobbleSuccessful;
    }

    private async performGetRequestAsync(method: string, headers: any): Promise<any> {
        const url: string = `https://api.listenbrainz.org/1/${method}`;
        const response: Response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const jsonResponse: any = await response.json();
            return jsonResponse;
        }

        return undefined;
    }

    private async performPostRequestAsync(method: string, requestBody: any, headers: any): Promise<any> {
        const url: string = `https://api.listenbrainz.org/1/${method}`;
        const response: Response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            const jsonResponse: any = await response.json();
            return jsonResponse;
        }

        return undefined;
    }
}
