import { Injectable } from '@angular/core';
import { Track } from '../../common/data/entities/track';
import { TrackFiller } from '../indexing/track-filler';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { TrackModel } from './track-model';

@Injectable()
export class TrackModelFactory {
    public constructor(private translatorService: BaseTranslatorService, private trackFiller: TrackFiller) {}

    public createFromTrack(track: Track): TrackModel {
        return new TrackModel(track, this.translatorService);
    }

    public async createFromFileAsync(filePath: string): Promise<TrackModel> {
        const track: Track = new Track(filePath);
        const filledTrack: Track = await this.trackFiller.addFileMetadataToTrackAsync(track);

        return new TrackModel(filledTrack, this.translatorService);
    }
}
