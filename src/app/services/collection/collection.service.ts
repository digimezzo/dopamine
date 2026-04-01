import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Logger } from '../../common/logger';
import { TrackModel } from '../track/track-model';
import { CollectionServiceBase } from './collection.service.base';
import { PlaybackService } from '../playback/playback.service';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { DesktopBase } from '../../common/io/desktop.base';
import { FileAccessBase } from '../../common/io/file-access.base';

@Injectable()
export class CollectionService implements CollectionServiceBase {
    private collectionChanged: Subject<void> = new Subject();

    public constructor(
        private playbackService: PlaybackService,
        private trackRepository: TrackRepositoryBase,
        private desktop: DesktopBase,
        private fileAccess: FileAccessBase,
        private logger: Logger,
    ) {}

    public collectionChanged$: Observable<void> = this.collectionChanged.asObservable();

    public async deleteTracksAsync(tracks: TrackModel[]): Promise<boolean> {
        let couldDeleteAllTracks: boolean = true;

        this.trackRepository.deleteTracks(tracks.map((x) => x.id));

        for (const track of tracks) {
            await this.playbackService.stopIfPlayingAsync(track);

            try {
                await this.desktop.moveFileToTrashAsync(track.path);
            } catch (e: unknown) {
                this.logger.warn(
                    `Could not move file '${track.path}' to the trash. Attempting permanent delete.`,
                    'CollectionService',
                    'deleteTracksAsync',
                );

                try {
                    await this.fileAccess.deleteFileIfExistsAsync(track.path);
                } catch (e2: unknown) {
                    this.logger.error(e2, `Could not permanently delete file '${track.path}'`, 'CollectionService', 'deleteTracksAsync');
                    couldDeleteAllTracks = false;
                }
            }
        }

        this.collectionChanged.next();

        return couldDeleteAllTracks;
    }
}
