import { Injectable } from '@angular/core';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { Track } from '../../data/entities/track';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { Timer } from '../../core/timer';

@Injectable({
    providedIn: 'root'
})
export class CollectionIndexer {
    constructor(
        private trackRepository: BaseTrackRepository,
        private fileSystem: FileSystem,
        private logger: Logger) { }

    public async indexCollectionAsync(): Promise<void> {
        this.removeTracks();
    }

    private removeTracks(): void {
        try {
            const timer: Timer = new Timer();
            timer.start();

            // 1. Remove tracks from the database which are not part of a collection folder
            let numberofRemovedTracks: number = this.trackRepository.deleteTracksThatDoNotBelongFolders();

            // 2. Remove tracks from the database which are not found on disk
            const tracks: Track[] = this.trackRepository.getTracks();

            for (const track of tracks) {
                if (!this.fileSystem.pathExists(track.path)) {
                    this.trackRepository.deleteTrack(track.trackId);
                    numberofRemovedTracks++;
                }
            }

            timer.stop();

            this.logger.info(
                `Tracks removed: ${numberofRemovedTracks}. Time required: ${timer.elapsedMilliseconds} ms`,
                'CollectionIndexer',
                'removeTracks');
        } catch (error) {
            this.logger.error(`A problem occurred while removing tracks. Error: ${error}`, 'CollectionIndexer', 'removeTracks');
        }
    }
}
