import { Injectable } from '@angular/core';
import { Track } from '../../data/entities/track';
import { DateTime } from '../../common/date-time';
import { TrackFiller } from '../indexing/track-filler';
import { TrackModel } from './track-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';

@Injectable()
export class TrackModelFactory {
    public constructor(
        private translatorService: TranslatorServiceBase,
        private trackFiller: TrackFiller,
        private dateTime: DateTime,
    ) {}

    public createFromTrack(track: Track, albumKeyIndex: string): TrackModel {
        return new TrackModel(track, this.dateTime, this.translatorService, albumKeyIndex);
    }

    public async createFromFileAsync(filePath: string, albumKeyIndex: string): Promise<TrackModel> {
        const track: Track = new Track(filePath);
        const filledTrack: Track = await this.trackFiller.addFileMetadataToTrackAsync(track, true);

        return new TrackModel(filledTrack, this.dateTime, this.translatorService, albumKeyIndex);
    }
}
