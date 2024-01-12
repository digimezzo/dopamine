const { MimeTypes } = require('./mime-types');
const { Logger } = require('../common/logger');
const { FileAccess } = require('../common/file-access');
const { AlbumKeyGenerator } = require('./album-key-generator');
const { TrackFieldCreator } = require('./track-field-creator');
const { FileMetadataFactory } = require('./file-metadata-factory');
const { DateTime } = require('../common/date-time');
const { StringUtils } = require('../common/string-utils');

class TrackFiller {
    static addFileMetadataToTrack(track, fillOnlyEssentialMetadata) {
        try {
            const fileMetadata = FileMetadataFactory.create(track.path);

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
                track.mimeType = this.#getMimeType(track.path);
                track.bitRate = TrackFieldCreator.createNumberField(fileMetadata.bitRate);
                track.sampleRate = TrackFieldCreator.createNumberField(fileMetadata.sampleRate);
                track.trackCount = TrackFieldCreator.createNumberField(fileMetadata.trackCount);
                track.discNumber = TrackFieldCreator.createNumberField(fileMetadata.discNumber);
                track.discCount = TrackFieldCreator.createNumberField(fileMetadata.discCount);
                track.year = TrackFieldCreator.createNumberField(fileMetadata.year);
                track.hasLyrics = this.#getHasLyrics(fileMetadata.lyrics);
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

            Logger.error(e, `Error while retrieving tag information for file ${track.path}`, 'TrackFiller', 'addFileMetadataToTrackAsync');
        }

        return track;
    }

    static #getMimeType(filePath) {
        return MimeTypes.getMimeTypeForFileExtension(FileAccess.getFileExtension(filePath));
    }

    static #getHasLyrics(lyrics) {
        if (!StringUtils.isNullOrWhiteSpace(lyrics)) {
            return 1;
        }

        return 0;
    }
}

exports.TrackFiller = TrackFiller;
