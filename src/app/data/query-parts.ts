export class QueryParts {
    public static selectAlbumDataQueryPart(): string {
        return `SELECT t.AlbumTitle, t.AlbumArtists, t.AlbumKey,
                    MAX(t.TrackTitle) as TrackTitle,
                    MAX(t.Artists) as Artists,
                    MAX(t.Year) AS Year,
                    MAX(t.DateFileCreated) AS DateFileCreated,
                    MAX(t.DateAdded) AS DateAdded FROM Track t`;
    }
}
