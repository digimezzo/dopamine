/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SensitiveInformation } from '../../application/sensitive-information';

@Injectable()
export class FanartApi {
    public constructor(private httpClient: HttpClient) {}

    public async getArtistThumbnailAsync(musicBrainzId: string): Promise<string> {
        const url: string = `http://webservice.fanart.tv/v3/music/${musicBrainzId}?api_key=${SensitiveInformation.fanartApiKey}`;
        const response: any = await this.httpClient.get<any>(url).toPromise();

        return response.artistthumb[0].url;
    }
}
