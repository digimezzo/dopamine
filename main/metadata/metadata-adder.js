const { TrackFieldCreator } = require('./track-field-creator');
const { FileAccess } = require('./file-access');
const { DateTime } = require('./date-time');
const { MimeTypes } = require('./mime-types');
const { AlbumKeyGenerator } = require('./album-key-generator');
const { TagLibFileMetadata } = require('./tag-lib-file-metadata');
const log = require('electron-log');

class MetadataAdder {
    static async addMetadataToIndexableTrackAsync(indexableTrack, fillOnlyEssentialMetadata) {
        try {
            const fileMetadata = TagLibFileMetadata.getMetadata(indexableTrack.path);

            indexableTrack.artists = TrackFieldCreator.createMultiTextField(fileMetadata.artists);
            indexableTrack.rating = TrackFieldCreator.createNumberField(fileMetadata.rating);
            indexableTrack.fileName = FileAccess.getFileName(indexableTrack.path);
            indexableTrack.duration = TrackFieldCreator.createNumberField(fileMetadata.durationInMilliseconds);
            indexableTrack.trackTitle = TrackFieldCreator.createTextField(fileMetadata.title);
            indexableTrack.trackNumber = TrackFieldCreator.createNumberField(fileMetadata.trackNumber);
            indexableTrack.fileSize = FileAccess.getFileSizeInBytes(indexableTrack.path);
            indexableTrack.albumKey = AlbumKeyGenerator.generateAlbumKey(fileMetadata.album, fileMetadata.albumArtists);

            if (!fillOnlyEssentialMetadata) {
                const dateNowTicks = DateTime.convertDateToTicks(new Date());

                indexableTrack.genres = TrackFieldCreator.createMultiTextField(fileMetadata.genres);
                indexableTrack.albumTitle = TrackFieldCreator.createTextField(fileMetadata.album);
                indexableTrack.albumArtists = TrackFieldCreator.createMultiTextField(fileMetadata.albumArtists);
                indexableTrack.mimeType = this.getMimeType(indexableTrack.path);
                indexableTrack.bitRate = TrackFieldCreator.createNumberField(fileMetadata.bitRate);
                indexableTrack.sampleRate = TrackFieldCreator.createNumberField(fileMetadata.sampleRate);
                indexableTrack.trackCount = TrackFieldCreator.createNumberField(fileMetadata.trackCount);
                indexableTrack.discNumber = TrackFieldCreator.createNumberField(fileMetadata.discNumber);
                indexableTrack.discCount = TrackFieldCreator.createNumberField(fileMetadata.discCount);
                indexableTrack.year = TrackFieldCreator.createNumberField(fileMetadata.year);
                indexableTrack.hasLyrics = this.getHasLyrics(fileMetadata.lyrics);
                indexableTrack.dateAdded = dateNowTicks;
                indexableTrack.dateFileCreated = FileAccess.getDateCreatedInTicks(indexableTrack.path);
                indexableTrack.dateLastSynced = dateNowTicks;
                indexableTrack.dateFileModified = FileAccess.getDateModifiedInTicks(indexableTrack.path);
            }

            indexableTrack.needsIndexing = 0;
            indexableTrack.needsAlbumArtworkIndexing = 1;
            indexableTrack.indexingSuccess = 1;
            indexableTrack.indexingFailureReason = '';
        } catch (e) {
            indexableTrack.indexingSuccess = 0;
            indexableTrack.indexingFailureReason = e instanceof Error ? e.message : 'Unknown error';

            log.error(
                `[MetadataAdder] [addMetadataToIndexableTrackAsync] Could not get tag information for file ${indexableTrack.path}. Error: ${e.message}'`,
            );
        }

        return indexableTrack;
    }

    static async addMetadataToIndexableTracksAsync(indexableTracks, fillOnlyEssentialMetadata) {
        const filledIndexableTracks = [];

        for (const indexableTrack of indexableTracks) {
            const filledIndexableTrack = await this.addMetadataToIndexableTrackAsync(indexableTrack, fillOnlyEssentialMetadata);
            filledIndexableTracks.push(filledIndexableTrack);
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

exports.MetadataAdder = MetadataAdder;
