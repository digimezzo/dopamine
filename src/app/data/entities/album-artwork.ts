export class AlbumArtwork {
    public constructor(
        public albumKey: string,
        public artworkId: string,
        public isManuallySet: number = 0,
    ) {}

    public albumArtworkId: string;
}
