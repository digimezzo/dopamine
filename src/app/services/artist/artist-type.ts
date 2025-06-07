export enum ArtistType {
    trackArtists = 1,
    albumArtists = 2,
    allArtists = 3,
}

export function artistTypeKey(artistType: ArtistType): string {
    switch (artistType) {
        case ArtistType.trackArtists:
            return 'track-artists';
        case ArtistType.albumArtists:
            return 'album-artists';
        case ArtistType.allArtists:
            return 'all-artists';
    }
}
