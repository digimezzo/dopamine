const { TrackFieldCreator } = require('./track-field-creator');
const { FileAccess } = require('./file-access');
const { DateTime } = require('./date-time');
const { MimeTypes } = require('./mime-types');
const { AlbumKeyGenerator } = require('./album-key-generator');
const { TagLibFileMetadata } = require('./tag-lib-file-metadata');
const log = require('electron-log');

class MetadataAdder {
    static async addMetadataToTrackAsync(track, fillOnlyEssentialMetadata) {
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

            log.error(`[MetadataAdder] [addMetadataToTrackAsync] Could not get metadata for file ${track.path}. Error: ${e.message}'`);
        }

        return track;
    }

    static async addMetadataToTracksAsync(tracks, fillOnlyEssentialMetadata) {
        const filledTracks = [];

        for (const track of tracks) {
            const filledTrack = await this.addMetadataToTrackAsync(track, fillOnlyEssentialMetadata);
            filledTracks.push(filledTrack);
        }

        return filledTracks;
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
