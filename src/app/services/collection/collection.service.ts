import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { Desktop } from '../../common/io/desktop';
import { Logger } from '../../common/logger';
import { BasePlaybackService } from '../playback/base-playback.service';
import { TrackModel } from '../track/track-model';
import { BaseCollectionService } from './base-collection.service';

@Injectable()
export class CollectionService implements BaseCollectionService {
    private collectionChanged: Subject<void> = new Subject();

    constructor(
        private playbackService: BasePlaybackService,
        private trackRepository: BaseTrackRepository,
        private desktop: Desktop,
        private logger: Logger
    ) {}

    public collectionChanged$: Observable<void> = this.collectionChanged.asObservable();

    public async deleteTracksAsync(tracks: TrackModel[]): Promise<boolean> {
        let couldDeleteAllTracks: boolean = true;

        this.trackRepository.deleteTracks(tracks.map((x) => x.id));

        for (const track of tracks) {
            await this.playbackService.stopIfPlaying(track);

            try {
                await this.desktop.moveFileToTrashAsync(track.path);
            } catch (e) {
                this.logger.error(
                    `Could not move file '${track.path}' to the trash. Error: ${e.message}`,
                    'CollectionService',
                    'deleteTracksAsync'
                );
                couldDeleteAllTracks = false;
            }
        }

        this.collectionChanged.next();

        return couldDeleteAllTracks;
    }
}
