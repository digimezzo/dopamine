/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArrayUtils } from '../../utils/array-utils';

interface MusicBrainzArtist {
    id: string;
    name: string;
    aliases: [
        {
            name: string;
        },
    ];
}

@Injectable()
export class MusicBrainzApi {
    public constructor(private httpClient: HttpClient) {}

    public async getMusicBrainzIdAsync(artistName: string): Promise<string> {
        artistName = this.normalize(artistName);
        const url: string = `http://musicbrainz.org/ws/2/artist/?fmt=json&query=artist:${encodeURIComponent(artistName)}`;
        const jsonResponse: any = await this.httpClient.get<any>(url).toPromise();

        if (this.isJsonResponseValid(jsonResponse)) {
            // https://musicbrainz.org/doc/MusicBrainz_API/Search#Artist
            const artists: MusicBrainzArtist[] = jsonResponse.artists ?? [];
            return this.getArtistByNameOrAlias(artists, artistName)?.id ?? '';
        } else {
            throw new Error(jsonResponse?.error !== undefined ? (jsonResponse.error as string) : 'Unknown error');
        }
    }

    private normalize(artistName: string): string {
        return artistName.replace(/'/g, '’').normalize('NFKC').toLowerCase();
    }

    private getArtistByNameOrAlias(artists: MusicBrainzArtist[], artistName: string): MusicBrainzArtist | undefined {
        for (const artist of artists) {
            if (artist.name?.toLowerCase() === artistName) {
                return artist;
            }

            if (!ArrayUtils.isNullOrEmpty(artist.aliases)) {
                for (const alias of artist.aliases) {
                    if (alias.name?.toLowerCase() === artistName) {
                        return artist;
                    }
                }
            }
        }
    }

    private isJsonResponseValid(jsonResponse: any): boolean {
        return jsonResponse != undefined && jsonResponse.error == undefined;
    }
}
