import { Injectable } from '@angular/core';
import { DataDelimiter } from './data-delimiter';
import { ArtistSplitter } from '../services/artist/artist-splitter';
import { StringUtils } from '../common/utils/string-utils';

@Injectable()
export class ArtistsKeyGenerator {
    public constructor(private artistSplitter: ArtistSplitter) {}

    public generateArtistsKey(artists: string | undefined): string {
        if (StringUtils.isNullOrWhiteSpace(artists)) {
            return '';
        } else {
            const individualArtists: string[] = this.artistSplitter
                .splitArtists(DataDelimiter.fromDelimitedString(artists))
                .map((artist: string): string => artist.toLowerCase())
                .filter((artist: string): boolean => artist !== '');

            return DataDelimiter.toDelimitedString(individualArtists);
        }
    }
}
