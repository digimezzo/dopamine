import { Injectable } from '@angular/core';
import { ListRandomizer } from '../../common/list-randomizer';
import { Logger } from '../../common/logger';
import { TrackModel } from '../track/track-model';

@Injectable()
export class Queue {
    private _tracks: TrackModel[] = [];
    private playbackOrder: number[] = [];

    constructor(private listRandomizer: ListRandomizer, private logger: Logger) {}

    public get tracks(): TrackModel[] {
        return this._tracks;
    }

    public setTracks(tracksToSet: TrackModel[], shuffle: boolean): void {
        this._tracks = tracksToSet;

        if (shuffle) {
            this.shuffle();
        } else {
            this.unShuffle();
        }

        this.logger.info(`Set '${tracksToSet?.length}' tracks. Shuffle=${shuffle}`, 'Queue', 'setTracks');
    }

    public addTracks(tracksToAdd: TrackModel[]): void {
        for (const trackToAdd of tracksToAdd) {
            this._tracks.push(trackToAdd);
            this.playbackOrder.push(this._tracks.length - 1);
        }

        this.logger.info(`Added '${tracksToAdd?.length}' tracks`, 'Queue', 'addTracks');
    }

    public removeTracks(tracksToRemove: TrackModel[]): void {
        if (tracksToRemove == undefined) {
            return;
        }

        if (tracksToRemove.length === 0) {
            return;
        }

        for (const trackToRemove of tracksToRemove) {
            const trackIndex: number = this._tracks.indexOf(trackToRemove);

            if (trackIndex !== -1) {
                this.removeFromTracks(trackIndex);
                this.removeFromPlaybackOrder(trackIndex);
            }
        }
    }

    public shuffle(): void {
        this.populatePlayBackOrder();
        this.shufflePlaybackOrder();
    }

    public unShuffle(): void {
        this.populatePlayBackOrder();
    }

    public getPreviousTrack(currentTrack: TrackModel, allowWrapAround: boolean): TrackModel {
        if (this._tracks.length === 0) {
            return undefined;
        }

        const minimumIndex: number = 0;
        const maximumIndex: number = this.playbackOrder.length - 1;
        const currentIndex: number = this.findPlaybackOrderIndex(currentTrack);

        if (currentTrack == undefined) {
            return this._tracks[this.playbackOrder[minimumIndex]];
        }

        if (!this._tracks.includes(currentTrack)) {
            return this._tracks[this.playbackOrder[minimumIndex]];
        }

        if (currentIndex > minimumIndex) {
            return this._tracks[this.playbackOrder[currentIndex - 1]];
        }

        if (allowWrapAround) {
            return this._tracks[this.playbackOrder[maximumIndex]];
        }

        return undefined;
    }

    public getNextTrack(currentTrack: TrackModel, allowWrapAround: boolean): TrackModel {
        if (this._tracks.length === 0) {
            return undefined;
        }

        const minimumIndex: number = 0;
        const maximumIndex: number = this.playbackOrder.length - 1;
        const currentIndex: number = this.findPlaybackOrderIndex(currentTrack);

        if (currentTrack == undefined) {
            return this._tracks[this.playbackOrder[minimumIndex]];
        }

        if (!this._tracks.includes(currentTrack)) {
            return this._tracks[this.playbackOrder[minimumIndex]];
        }

        if (currentIndex < maximumIndex) {
            return this._tracks[this.playbackOrder[currentIndex + 1]];
        }

        if (allowWrapAround) {
            return this._tracks[this.playbackOrder[minimumIndex]];
        }

        return undefined;
    }

    private populatePlayBackOrder(): void {
        this.playbackOrder = [];

        for (let i: number = 0; i < this._tracks.length; i++) {
            this.playbackOrder.push(i);
        }
    }

    private shufflePlaybackOrder(): void {
        this.playbackOrder = this.listRandomizer.randomizeNumbers(this.playbackOrder);
    }

    private findPlaybackOrderIndex(track: TrackModel): number {
        const queuedTracksIndex: number = this._tracks.indexOf(track);

        return this.playbackOrder.indexOf(queuedTracksIndex);
    }

    private removeFromTracks(trackIndex: number): void {
        this._tracks.splice(trackIndex, 1);
    }

    private removeFromPlaybackOrder(trackIndex: number): void {
        const playbackOrderIndex: number = this.playbackOrder.indexOf(trackIndex);

        if (playbackOrderIndex !== -1) {
            this.playbackOrder.splice(playbackOrderIndex, 1);

            for (let index = 0; index < this.playbackOrder.length; index++) {
                if (this.playbackOrder[index] > trackIndex) {
                    this.playbackOrder[index] -= 1;
                }
            }
        }
    }
}
