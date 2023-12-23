import { TrackFieldCreator } from './track-field-creator';
import { Track } from '../src/app/data/entities/track';
import { IndexablePath } from '../src/app/services/indexing/indexable-path';
import { IndexableTrack } from '../src/app/services/indexing/indexable-track';
import { StringUtils } from '../src/app/common/utils/string-utils';
import { AlbumKeyGenerator } from './album-key-generator';
import { FileAccess } from './file-access';
import { DateTime } from './date-time';
import { MimeTypes } from './mime-types';
import { IFileMetadata } from '../src/app/common/metadata/i-file-metadata';
import { FileMetadataFactory } from './file-metadata-factory';

export class TrackFiller {
    public static async addFileMetadataToTrackAsync(track: Track, fillOnlyEssentialMetadata: boolean): Promise<Track> {
        try {
            const fileMetadata: IFileMetadata = await FileMetadataFactory.createAsync(track.path);

            track.artists = TrackFieldCreator.createMultiTextField(fileMetadata.artists);
            track.rating = TrackFieldCreator.createNumberField(fileMetadata.rating);
            track.fileName = FileAccess.getFileName(track.path);
            track.duration = TrackFieldCreator.createNumberField(fileMetadata.durationInMilliseconds);
            track.trackTitle = TrackFieldCreator.createTextField(fileMetadata.title);
            track.trackNumber = TrackFieldCreator.createNumberField(fileMetadata.trackNumber);
            track.fileSize = FileAccess.getFileSizeInBytes(track.path);
            track.albumKey = AlbumKeyGenerator.generateAlbumKey(fileMetadata.album, fileMetadata.albumArtists);

            if (!fillOnlyEssentialMetadata) {
                const dateNowTicks: number = DateTime.convertDateToTicks(new Date());

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
        } catch (e: unknown) {
            track.indexingSuccess = 0;

            track.indexingFailureReason = e instanceof Error ? e.message : 'Unknown error';

            // this.logger.error(
            //     e,
            //     'Error while retrieving tag information for file ${track.path}',
            //     'TrackFiller',
            //     'addFileMetadataToTrackAsync',
            // );
        }

        return track;
    }

    public static async addFileMetadataToTracksAsync(
        indexablePaths: IndexablePath[],
        fillOnlyEssentialMetadata: boolean,
    ): Promise<IndexableTrack[]> {
        const filledIndexableTracks: IndexableTrack[] = [];

        for (const indexablePath of indexablePaths) {
            const track: Track = new Track(indexablePath.path);
            await this.addFileMetadataToTrackAsync(track, fillOnlyEssentialMetadata);

            filledIndexableTracks.push(new IndexableTrack(track, indexablePath.dateModifiedTicks, indexablePath.folderId));
        }

        return filledIndexableTracks;
    }

    private static getMimeType(filePath: string): string {
        return MimeTypes.getMimeTypeForFileExtension(FileAccess.getFileExtension(filePath));
    }

    private static getHasLyrics(lyrics: string): number {
        if (!StringUtils.isNullOrWhiteSpace(lyrics)) {
            return 1;
        }

        return 0;
    }
}
