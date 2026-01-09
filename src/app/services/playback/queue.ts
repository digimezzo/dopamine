import { Injectable } from '@angular/core';
import { Logger } from '../../common/logger';
import { Shuffler } from '../../common/shuffler';
import { TrackModel } from '../track/track-model';

@Injectable({ providedIn: 'root' })
export class Queue {
    private _tracks: TrackModel[] = [];
    private playbackOrder: number[] = [];

    private _priorityTracks: TrackModel[] = [];

    private _lastSystemTrack: TrackModel | undefined;

    public constructor(
        private shuffler: Shuffler,
        private logger: Logger,
    ) {}

    public get tracks(): TrackModel[] {
        return [...this._priorityTracks, ...this._tracks];
    }

    public get tracksInPlaybackOrder(): TrackModel[] {
        const tracksInPlaybackOrder: TrackModel[] = [];

        tracksInPlaybackOrder.push(...this._priorityTracks);

        for (const trackIndex of this.playbackOrder) {
            if (this._tracks[trackIndex]) {
                tracksInPlaybackOrder.push(this._tracks[trackIndex]);
            }
        }

        return tracksInPlaybackOrder;
    }

    public get numberOfTracks(): number {
        return this._tracks.length + this._priorityTracks.length;
    }

    public setTracks(tracksToSet: TrackModel[], shuffle: boolean): TrackModel[] {
        this._tracks = tracksToSet.map((x) => x.clone());
        this._priorityTracks = [];
        this._lastSystemTrack = undefined;

        if (shuffle) {
            this.shuffle();
        } else {
            this.unShuffle();
        }

        this.logger.info(`Set '${tracksToSet?.length}' tracks. Shuffle=${shuffle}`, 'Queue', 'setTracks');

        return this._tracks;
    }

    public addTracks(tracksToAdd: TrackModel[]): void {
        // Dodajemy do priorytetów (Spotify style)
        for (const trackToAdd of tracksToAdd) {
            this._priorityTracks.push(trackToAdd.clone());
        }
        this.logger.info(`Added '${tracksToAdd?.length}' tracks to priority queue`, 'Queue', 'addTracks');
    }

    public restoreTracks(tracks: TrackModel[], playbackOrder: number[]): void {
        this._tracks = tracks;
        this.playbackOrder = playbackOrder;
        this._priorityTracks = [];
        this.logger.info(`Restored '${tracks?.length}' tracks`, 'Queue', 'restoreTracks');
    }

    public removeTracks(tracksToRemove: TrackModel[] | undefined): void {
        if (!tracksToRemove || tracksToRemove.length === 0) {
            return;
        }

        for (const trackToRemove of tracksToRemove) {
            // Usuń z priorytetów
            const priorityIndex = this._priorityTracks.indexOf(trackToRemove);
            if (priorityIndex !== -1) {
                this._priorityTracks.splice(priorityIndex, 1);
                continue;
            }

            // Usuń z systemu
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

    public getFirstTrack(): TrackModel | undefined {
        if (this._priorityTracks.length > 0) {
            return this._priorityTracks[0];
        }

        if (!this.playbackOrder || this.playbackOrder.length === 0) {
            return undefined;
        }

        return this._tracks[this.playbackOrder[0]];
    }

    public getPreviousTrack(currentTrack: TrackModel | undefined, allowWrapAround: boolean): TrackModel | undefined {
        if (this._tracks.length === 0 && this._priorityTracks.length === 0) return undefined;

        if (currentTrack && this._priorityTracks.includes(currentTrack)) {
            const index = this._priorityTracks.indexOf(currentTrack);
            if (index > 0) {
                return this._priorityTracks[index - 1];
            }
            return this._lastSystemTrack || this.getLastSystemTrack();
        }

        return this.getSystemPreviousTrack(currentTrack, allowWrapAround);
    }

    public getNextTrack(currentTrack: TrackModel | undefined, allowWrapAround: boolean): TrackModel | undefined {
        let nextTrack: TrackModel | undefined;

        if (currentTrack && this._priorityTracks.includes(currentTrack)) {
            const index = this._priorityTracks.indexOf(currentTrack);
            
            if (index < this._priorityTracks.length - 1) {
                nextTrack = this._priorityTracks[index + 1];
            } else {
                nextTrack = this.getSystemNextTrack(this._lastSystemTrack, allowWrapAround);
            }
        } 
        else {
            if (currentTrack && this._tracks.includes(currentTrack)) {
                this._lastSystemTrack = currentTrack;
            }

            // Czy wpadło coś do priorytetów?
            if (this._priorityTracks.length > 0) {
                nextTrack = this._priorityTracks[0];
            } else {
                nextTrack = this.getSystemNextTrack(currentTrack, allowWrapAround);
            }
        }

        if (currentTrack) {
            // Próba usunięcia z priorytetów
            const priorityIndex = this._priorityTracks.indexOf(currentTrack);
            if (priorityIndex !== -1) {
                this._priorityTracks.splice(priorityIndex, 1);
            } 
            // Próba usunięcia z systemu
            else {
                const trackIndex = this._tracks.indexOf(currentTrack);
                if (trackIndex !== -1) {
                    this.removeFromTracks(trackIndex);
                    this.removeFromPlaybackOrder(trackIndex);
                }
            }
        }

        return nextTrack;
    }


    private getSystemPreviousTrack(currentTrack: TrackModel | undefined, allowWrapAround: boolean): TrackModel | undefined {
        if (this._tracks.length === 0) return undefined;

        const minimumIndex: number = 0;
        const maximumIndex: number = this.playbackOrder.length - 1;

        if (currentTrack == undefined || !this._tracks.includes(currentTrack)) {
            return this._tracks[this.playbackOrder[minimumIndex]];
        }

        const currentIndex: number = this.getPlaybackOrderIndex(currentTrack);

        if (currentIndex > minimumIndex) {
            return this._tracks[this.playbackOrder[currentIndex - 1]];
        }

        if (allowWrapAround) {
            return this._tracks[this.playbackOrder[maximumIndex]];
        }
        return undefined;
    }

    private getSystemNextTrack(currentTrack: TrackModel | undefined, allowWrapAround: boolean): TrackModel | undefined {
        if (this._tracks.length === 0) return undefined;

        const minimumIndex: number = 0;
        const maximumIndex: number = this.playbackOrder.length - 1;
        
        if (currentTrack == undefined || !this._tracks.includes(currentTrack)) {
            return this._tracks[this.playbackOrder[minimumIndex]];
        }

        const currentIndex: number = this.getPlaybackOrderIndex(currentTrack);

        if (currentIndex < maximumIndex) {
            return this._tracks[this.playbackOrder[currentIndex + 1]];
        }

        if (allowWrapAround) {
            return this._tracks[this.playbackOrder[minimumIndex]];
        }
        return undefined;
    }

    private getLastSystemTrack(): TrackModel | undefined {
        if (this.playbackOrder.length === 0) return undefined;
        return this._tracks[this.playbackOrder[this.playbackOrder.length - 1]];
    }

    private populatePlayBackOrder(): void {
        this.playbackOrder = [];
        for (let i: number = 0; i < this._tracks.length; i++) {
            this.playbackOrder.push(i);
        }
    }

    private shufflePlaybackOrder(): void {
        this.playbackOrder = this.shuffler.shuffle<number>(this.playbackOrder);
    }

    public getPlaybackOrderIndex(track: TrackModel): number {
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