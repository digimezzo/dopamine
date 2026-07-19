export class ArtistArtwork {
    public constructor(
        public artist: string,
        public artworkId: string,
        public isManuallySet: number = 0,
    ) {}

    public artistArtworkId: string;
}
