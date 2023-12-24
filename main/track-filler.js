const { TrackFieldCreator } = require('./track-field-creator');
const { FileAccess } = require('./file-access');
const { DateTime } = require('./date-time');
const { MimeTypes } = require('./mime-types');
const { AlbumKeyGenerator } = require('./album-key-generator');
const { TagLibFileMetadata } = require('./tag-lib-file-metadata');

class TrackFiller {
    static async addFileMetadataToTrackAsync(track, fillOnlyEssentialMetadata) {
        try {
            const fileMetadata = TagLibFileMetadata.getMetadata(track.path);

            track.artists = TrackFieldCreator.createMultiTextField(fileMetadata.artists);
            track.rating = TrackFieldCreator.createNumberField(fileMetadata.rating);
            track.fileName = FileAccess.getFileName(track.path);
            track.duration = TrackFieldCreator.createNumberField(fileMetadata.durationInMilliseconds);
            track.trackTitle = TrackFieldCreator.createTextField(fileMetadata.title);
            track.trackNumber = TrackFieldCreator.createNumberField(fileMetadata.trackNumber);
            track.fileSize = FileAccess.getFileSizeInBytes(track.path);
            track.albumKey = AlbumKeyGenerator.generateAlbumKey(fileMetadata.album, fileMetadata.albumArtists);

            if (!fillOnlyEssentialMetadata) {
                const dateNowTicks = DateTime.convertDateToTicks(new Date());

                track.genres = TrackFieldCreator.createMultiTextField(fileMetadata.genres);
                track.albumTitle = TrackFieldCreator.createTextField(fileMetadata.album);
                track.albumArtists = TrackFieldCreator.createMultiTextField(fileMetadata.albumArtists);
                track.mimeType = this.getMimeType(track.path);
                track.bitRate = TrackFieldCreator.createNumberField(fileMetadata.bitRate);
                track.sampleRate = TrackFieldCreator.createNumberField(fileMetadata.sampleRate);
                track.trackCount = TrackFieldCreator.createNumberField(fileMetadata.trackCount);
                track.discNumber = TrackFieldCreator.createNumberField(fileMetadata.discNumber);
                track.discCount = TrackFieldCreator.createNumberField(fileMetadata.discCount);
                track.year = TrackFieldCreator.createNumberField(fileMetadata.year);
                track.hasLyrics = this.getHasLyrics(fileMetadata.lyrics);
                track.dateAdded = dateNowTicks;
                track.dateFileCreated = FileAccess.getDateCreatedInTicks(track.path);
                track.dateLastSynced = dateNowTicks;
                track.dateFileModified = FileAccess.getDateModifiedInTicks(track.path);
            }

            track.needsIndexing = 0;
            track.needsAlbumArtworkIndexing = 1;
            track.indexingSuccess = 1;
            track.indexingFailureReason = '';
        } catch (e) {
            track.indexingSuccess = 0;
            track.indexingFailureReason = e instanceof Error ? e.message : 'Unknown error';
        }

        return track;
    }

    static async addFileMetadataToTracksAsync(indexablePaths, fillOnlyEssentialMetadata) {
        const filledIndexableTracks = [];

        for (const indexablePath of indexablePaths) {
            const track = {
                path: indexablePath.path,
                trackId: 0,
                artists: '',
                genres: '',
                albumTitle: '',
                albumArtists: '',
                albumKey: '',
                fileName: '',
                mimeType: '',
                fileSize: 0,
                bitRate: 0,
                sampleRate: 0,
                trackTitle: '',
                trackNumber: 0,
                trackCount: 0,
                discNumber: 0,
                discCount: 0,
                duration: 0,
                year: 0,
                hasLyrics: 0,
                dateAdded: 0,
                dateFileCreated: 0,
                dateLastSynced: 0,
                dateFileModified: 0,
                needsIndexing: 0,
                needsAlbumArtworkIndexing: 0,
                indexingSuccess: 0,
                indexingFailureReason: '',
                rating: 0,
                love: 0,
                playCount: 0,
                skipCount: 0,
                dateLastPlayed: 0,
            };
            await this.addFileMetadataToTrackAsync(track, fillOnlyEssentialMetadata);

            filledIndexableTracks.push({
                folderId: indexablePath.folderId,
                dateModifiedTicks: indexablePath.dateModifiedTicks,
                path: indexablePath.path,
                trackId: track.trackId,
                artists: track.artists,
                genres: track.genres,
                albumTitle: track.albumTitle,
                albumArtists: track.albumArtists,
                albumKey: track.albumKey,
                fileName: track.fileName,
                mimeType: track.mimeType,
                fileSize: track.fileSize,
                bitRate: track.bitRate,
                sampleRate: track.sampleRate,
                trackTitle: track.trackTitle,
                trackNumber: track.trackNumber,
                trackCount: track.trackCount,
                discNumber: track.discNumber,
                discCount: track.discCount,
                duration: track.duration,
                year: track.year,
                hasLyrics: track.hasLyrics,
                dateAdded: track.dateAdded,
                dateFileCreated: track.dateFileCreated,
                dateLastSynced: track.dateLastSynced,
                dateFileModified: track.dateFileModified,
                needsIndexing: track.needsIndexing,
                needsAlbumArtworkIndexing: track.needsAlbumArtworkIndexing,
                indexingSuccess: track.indexingSuccess,
                indexingFailureReason: track.indexingFailureReason,
                rating: track.rating,
                love: track.love,
                playCount: track.playCount,
                skipCount: track.skipCount,
                dateLastPlayed: track.dateLastPlayed,
            });
        }

        return filledIndexableTracks;
    }

    static getMimeType(filePath) {
        return MimeTypes.getMimeTypeForFileExtension(FileAccess.getFileExtension(filePath));
    }

    static getHasLyrics(lyrics) {
        if (lyrics !== undefined && lyrics.length > 0) {
            return 1;
        }

        return 0;
    }
}

exports.TrackFiller = TrackFiller;
