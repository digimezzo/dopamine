import { Injectable } from '@angular/core';
import { Track } from '../../data/entities/track';
import { DateTime } from '../../common/date-time';
import { TrackFiller } from '../indexing/track-filler';
import { TrackModel } from './track-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { SettingsBase } from '../../common/settings/settings.base';

@Injectable()
export class TrackModelFactory {
    public constructor(
        private translatorService: TranslatorServiceBase,
        private trackFiller: TrackFiller,
        private dateTime: DateTime,
        private settings: SettingsBase,
    ) {}

    public createFromTrack(track: Track): TrackModel {
        return new TrackModel(track, this.dateTime, this.translatorService, this.settings);
    }

    public async createFromFileAsync(filePath: string): Promise<TrackModel> {
        const track: Track = new Track(filePath);
        const filledTrack: Track = await this.trackFiller.addFileMetadataToTrackAsync(track, true);

        return new TrackModel(filledTrack, this.dateTime, this.translatorService, this.settings);
    }
}
