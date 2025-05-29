import { Injectable } from '@angular/core';
import { MetadataService } from '../metadata/metadata.service';
import { TrackModel } from '../track/track-model';
import { PlaybackInformation } from './playback-information';

@Injectable({ providedIn: 'root' })
export class PlaybackInformationFactory {
    public constructor(private metadataService: MetadataService) {}

    public async createAsync(track: TrackModel | undefined): Promise<PlaybackInformation> {
        if (track != undefined) {
            const newImage: string = await this.metadataService.createAlbumImageUrlAsync(track, 0);

            return new PlaybackInformation(track, newImage);
        }

        return new PlaybackInformation(undefined, '');
    }
}
