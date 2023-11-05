import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { BaseDesktop } from '../../common/io/base-desktop';
import { Logger } from '../../common/logger';

import { TrackModel } from '../track/track-model';
import { CollectionServiceBase } from './collection.service.base';
import { PlaybackServiceBase } from '../playback/playback.service.base';

@Injectable()
export class CollectionService implements CollectionServiceBase {
    private collectionChanged: Subject<void> = new Subject();

    public constructor(
        private playbackService: PlaybackServiceBase,
        private trackRepository: BaseTrackRepository,
        private desktop: BaseDesktop,
        private logger: Logger,
    ) {}

    public collectionChanged$: Observable<void> = this.collectionChanged.asObservable();

    public async deleteTracksAsync(tracks: TrackModel[]): Promise<boolean> {
        let couldDeleteAllTracks: boolean = true;

        this.trackRepository.deleteTracks(tracks.map((x) => x.id));

        for (const track of tracks) {
            this.playbackService.stopIfPlaying(track);

            try {
                await this.desktop.moveFileToTrashAsync(track.path);
            } catch (e: unknown) {
                this.logger.error(e, `Could not move file '${track.path}' to the trash`, 'CollectionService', 'deleteTracksAsync');

                couldDeleteAllTracks = false;
            }
        }

        this.collectionChanged.next();

        return couldDeleteAllTracks;
    }
}
