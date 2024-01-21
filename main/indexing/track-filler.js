const { MimeTypes } = require('./mime-types');
const { StringUtils } = require('../common/utils/string-utils');

class TrackFiller {
    constructor(fileMetadataFactory, albumKeyGenerator, trackFieldCreator, mimeTypes, fileAccess, dateTime, logger) {
        this.fileMetadataFactory = fileMetadataFactory;
        this.albumKeyGenerator = albumKeyGenerator;
        this.trackFieldCreator = trackFieldCreator;
        this.mimeTypes = mimeTypes;
        this.fileAccess = fileAccess;
        this.dateTime = dateTime;
        this.logger = logger;
    }

    addFileMetadataToTrack(track, fillOnlyEssentialMetadata) {
        try {
            const fileMetadata = this.fileMetadataFactory.create(track.path);

            track.artists = this.trackFieldCreator.createMultiTextField(fileMetadata.artists);
            track.rating = this.trackFieldCreator.createNumberField(fileMetadata.rating);
            track.fileName = this.fileAccess.getFileName(track.path);
            track.duration = this.trackFieldCreator.createNumberField(fileMetadata.durationInMilliseconds);
            track.trackTitle = this.trackFieldCreator.createTextField(fileMetadata.title);
            track.trackNumber = this.trackFieldCreator.createNumberField(fileMetadata.trackNumber);
            track.fileSize = this.fileAccess.getFileSizeInBytes(track.path);
            track.albumKey = this.albumKeyGenerator.generateAlbumKey(fileMetadata.album, fileMetadata.albumArtists);

            if (!fillOnlyEssentialMetadata) {
                const dateNowTicks = this.dateTime.convertDateToTicks(new Date());

                track.genres = this.trackFieldCreator.createMultiTextField(fileMetadata.genres);
                track.albumTitle = this.trackFieldCreator.createTextField(fileMetadata.album);
                track.albumArtists = this.trackFieldCreator.createMultiTextField(fileMetadata.albumArtists);
                track.mimeType = this.#getMimeType(track.path);
                track.bitRate = this.trackFieldCreator.createNumberField(fileMetadata.bitRate);
                track.sampleRate = this.trackFieldCreator.createNumberField(fileMetadata.sampleRate);
                track.trackCount = this.trackFieldCreator.createNumberField(fileMetadata.trackCount);
                track.discNumber = this.trackFieldCreator.createNumberField(fileMetadata.discNumber);
                track.discCount = this.trackFieldCreator.createNumberField(fileMetadata.discCount);
                track.year = this.trackFieldCreator.createNumberField(fileMetadata.year);
                track.hasLyrics = this.#getHasLyrics(fileMetadata.lyrics);
                track.dateAdded = dateNowTicks;
                track.dateFileCreated = this.fileAccess.getDateCreatedInTicks(track.path);
                track.dateLastSynced = dateNowTicks;
                track.dateFileModified = this.fileAccess.getDateModifiedInTicks(track.path);
            }

            track.needsIndexing = 0;
            track.needsAlbumArtworkIndexing = 1;
            track.indexingSuccess = 1;
            track.indexingFailureReason = '';
        } catch (e) {
            track.indexingSuccess = 0;
            track.indexingFailureReason = e instanceof Error ? e.message : 'Unknown error';

            this.logger.error(
                e,
                `Error while retrieving tag information for file ${track.path}`,
                'TrackFiller',
                'addFileMetadataToTrackAsync',
            );
        }

        return track;
    }

    #getMimeType(filePath) {
        return this.mimeTypes.getMimeTypeForFileExtension(this.fileAccess.getFileExtension(filePath));
    }

    #getHasLyrics(lyrics) {
        if (!StringUtils.isNullOrWhiteSpace(lyrics)) {
            return 1;
        }

        return 0;
    }
}

exports.TrackFiller = TrackFiller;
