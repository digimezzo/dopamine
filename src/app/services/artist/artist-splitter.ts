import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ArtistSplitter {
    public splitArtists(artists: string): string[] {
        return artists.split(',').map((artist) => artist.trim());
    }
}
