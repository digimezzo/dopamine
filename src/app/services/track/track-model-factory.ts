import { Injectable } from '@angular/core';
import { Track } from '../../data/entities/track';
import { DateTime } from '../../common/date-time';
import { TrackModel } from './track-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { MetadataAdder } from '../indexing/metadata-adder';

@Injectable()
export class TrackModelFactory {
    public constructor(
        private translatorService: TranslatorServiceBase,
        private metadataAdder: MetadataAdder,
        private dateTime: DateTime,
    ) {}

    public createFromTrack(track: Track): TrackModel {
        return new TrackModel(track, this.dateTime, this.translatorService);
    }

    public async createFromFileAsync(filePath: string): Promise<TrackModel> {
        const track: Track = new Track(filePath);
        const filledTrack: Track = await this.metadataAdder.addMetadataToTrackAsync(track, true);

        return new TrackModel(filledTrack, this.dateTime, this.translatorService);
    }
}
