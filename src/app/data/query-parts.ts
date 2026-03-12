export class QueryParts {
    public static selectTrackArtistsQueryPart(onlyVisibleArtists: boolean): string {
        let selectTrackArtistsQueryPart: string = `SELECT DISTINCT t.Artists as artists FROM Track t`;

        if (onlyVisibleArtists) {
            selectTrackArtistsQueryPart += ' ' + this.folderJoins();
        }

        return selectTrackArtistsQueryPart;
    }

    public static selectAlbumArtistsQueryPart(onlyVisibleArtists: boolean): string {
        let selectAlbumArtistsQueryPart: string = `SELECT DISTINCT t.AlbumArtists as artists FROM Track t`;

        if (onlyVisibleArtists) {
            selectAlbumArtistsQueryPart += ' ' + this.folderJoins();
        }

        return selectAlbumArtistsQueryPart;
    }

    public static selectGenresQueryPart(onlyVisibleGenres: boolean): string {
        let selectGenresQueryPart: string = `SELECT DISTINCT t.Genres as genres FROM Track t`;

        if (onlyVisibleGenres) {
            selectGenresQueryPart += ' ' + this.folderJoins();
        }

        return selectGenresQueryPart;
    }

    public static selectAlbumDataQueryPart(albumKeyIndex: string, onlyVisibleAlbumData: boolean): string {
        let selectAlbumDataQueryPart: string = `SELECT t.AlbumTitle AS albumTitle,
                                                       t.AlbumArtists AS albumArtists,
                                                       t.AlbumKey${albumKeyIndex} AS albumKey,
                                                       a.ArtworkID as artworkId,
                                                       MAX(t.Artists) AS artists,
                                                       MAX(t.Year) AS year,
                                                       GROUP_CONCAT(distinct t.Genres) AS genres,
                                                       MAX(t.DateFileCreated) AS dateFileCreated,
                                                       MAX(t.DateAdded) AS dateAdded,
                                                       MAX(t.DateLastPlayed) AS dateLastPlayed,
                                                       SUM(t.PlayCount) AS playCount FROM Track t
                                                       LEFT JOIN AlbumArtwork a ON t.AlbumKey${albumKeyIndex}=a.AlbumKey`;

        if (onlyVisibleAlbumData) {
            selectAlbumDataQueryPart += ' ' + this.folderJoins();
        }

        return selectAlbumDataQueryPart;
    }

    public static selectTracksQueryPart(onlyVisibleTracks: boolean): string {
        let selectTracksQueryPart: string = `SELECT DISTINCT t.TrackID AS trackId,
                                                             t.Artists AS artists,
                                                             t.Genres AS genres,
                                                             t.AlbumTitle AS albumTitle,
                                                             t.AlbumArtists AS albumArtists,
                                                             t.AlbumKey AS albumKey,
                                                             t.AlbumKey2 AS albumKey2,
                                                             t.AlbumKey3 AS albumKey3,
                                                             t.Path AS path,
                                                             t.FileName AS fileName,
                                                             t.MimeType AS mimeType,
                                                             t.FileSize AS fileSize,
                                                             t.BitRate AS bitRate,
                                                             t.SampleRate AS sampleRate,
                                                             t.TrackTitle AS trackTitle,
                                                             t.TrackNumber AS trackNumber,
                                                             t.TrackCount AS trackCount,
                                                             t.DiscNumber AS discNumber,
                                                             t.DiscCount AS discCount,
                                                             t.Duration AS duration,
                                                             t.Year AS year,
                                                             t.HasLyrics AS hasLyrics,
                                                             t.DateAdded AS dateAdded,
                                                             t.DateFileCreated AS dateFileCreated,
                                                             t.DateLastSynced AS dateLastSynced,
                                                             t.DateFileModified AS dateFileModified,
                                                             t.NeedsIndexing AS needsIndexing,
                                                             t.NeedsAlbumArtworkIndexing AS needsAlbumArtworkIndexing,
                                                             t.IndexingSuccess AS indexingSuccess,
                                                             t.IndexingFailureReason AS indexingFailureReason,
                                                             t.NewRating AS rating,
                                                             t.Love AS love,
                                                             t.PlayCount AS playCount,
                                                             t.SkipCount AS skipCount,
                                                             t.DateLastPlayed AS dateLastPlayed,
                                                             t.Composers AS composers,
                                                             t.Conductor AS conductor,
                                                             t.BeatsPerMinute AS beatsPerMinute
                                                             FROM Track t`;

        if (onlyVisibleTracks) {
            selectTracksQueryPart += ' ' + this.folderJoins();
        }

        return selectTracksQueryPart;
    }

    private static folderJoins(): string {
        return `INNER JOIN FolderTrack ft ON ft.TrackID = t.TrackID
                INNER JOIN Folder f ON ft.FolderID = f.FolderID
                WHERE f.ShowInCollection = 1 AND t.IndexingSuccess = 1 AND t.NeedsIndexing = 0`;
    }
}
