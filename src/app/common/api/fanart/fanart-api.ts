import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SensitiveInformation } from '../../application/sensitive-information';

@Injectable()
export class FanartApi {
    constructor(private httpClient: HttpClient) {}

    public async getArtistThumbnailAsync(musicBrainzId: string): Promise<string> {
        const url: string = `http://webservice.fanart.tv/v3/music/${musicBrainzId}?api_key=${SensitiveInformation.fanartApiKey}`;
        const response: any = await this.httpClient.get<any>(url).toPromise();

        return response.artistthumb[0].url;
    }
}
