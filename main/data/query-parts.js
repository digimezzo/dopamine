class QueryParts {
    static selectTrackArtistsQueryPart(onlyVisibleArtists) {
        let selectTrackArtistsQueryPart = `SELECT DISTINCT t.Artists as artists FROM Track t`;

        if (onlyVisibleArtists) {
            selectTrackArtistsQueryPart += ' ' + this.#folderJoins();
        }

        return selectTrackArtistsQueryPart;
    }

    static selectAlbumArtistsQueryPart(onlyVisibleArtists) {
        let selectAlbumArtistsQueryPart = `SELECT DISTINCT t.AlbumArtists as artists FROM Track t`;

        if (onlyVisibleArtists) {
            selectAlbumArtistsQueryPart += ' ' + this.#folderJoins();
        }

        return selectAlbumArtistsQueryPart;
    }

    static selectGenresQueryPart(onlyVisibleGenres) {
        let selectGenresQueryPart = `SELECT DISTINCT t.Genres as genres FROM Track t`;

        if (onlyVisibleGenres) {
            selectGenresQueryPart += ' ' + this.#folderJoins();
        }

        return selectGenresQueryPart;
    }

    static selectAlbumDataQueryPart(onlyVisibleAlbumData) {
        let selectAlbumDataQueryPart = `SELECT t.AlbumTitle AS albumTitle,
                                                       t.AlbumArtists AS albumArtists,
                                                       t.AlbumKey AS albumKey,
                                                       a.ArtworkID as artworkId,
                                                       MAX(t.Artists) AS artists,
                                                       MAX(t.Year) AS year,
                                                       MAX(t.DateFileCreated) AS dateFileCreated,
                                                       MAX(t.DateAdded) AS dateAdded,
                                                       MAX(t.DateLastPlayed) AS dateLastPlayed FROM Track t
                                                       LEFT JOIN AlbumArtwork a ON t.AlbumKey=a.AlbumKey`;

        if (onlyVisibleAlbumData) {
            selectAlbumDataQueryPart += ' ' + this.#folderJoins();
        }

        return selectAlbumDataQueryPart;
    }

    static selectTracksQueryPart(onlyVisibleTracks) {
        let selectTracksQueryPart = `SELECT DISTINCT t.TrackID AS trackId,
                                                             t.Artists AS artists,
                                                             t.Genres AS genres,
                                                             t.AlbumTitle AS albumTitle,
                                                             t.AlbumArtists AS albumArtists,
                                                             t.AlbumKey AS albumKey,
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
                                                             t.Rating AS rating,
                                                             t.Love AS love,
                                                             t.PlayCount AS playCount,
                                                             t.SkipCount AS skipCount,
                                                             t.DateLastPlayed AS dateLastPlayed
                                                             FROM Track t`;

        if (onlyVisibleTracks) {
            selectTracksQueryPart += ' ' + this.#folderJoins();
        }

        return selectTracksQueryPart;
    }

    static #folderJoins() {
        return `INNER JOIN FolderTrack ft ON ft.TrackID = t.TrackID
                INNER JOIN Folder f ON ft.FolderID = f.FolderID
                WHERE f.ShowInCollection = 1 AND t.IndexingSuccess = 1 AND t.NeedsIndexing = 0`;
    }
}

exports.QueryParts = QueryParts;
