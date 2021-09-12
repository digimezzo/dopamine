import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { TrackModels } from '../services/track/track-models';
import { BaseFilterPipe } from './base-filter.pipe';

@Pipe({ name: 'tracksFilter' })
export class TracksFilterPipe extends BaseFilterPipe implements PipeTransform {
    constructor() {
        super();
    }

    public transform(tracks: TrackModels, textToContain: string): TrackModels {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return tracks;
        }

        const filteredTracks: TrackModels = new TrackModels();

        for (const track of tracks.tracks) {
            if (this.containsText(track.title, textToContain)) {
                filteredTracks.addTrack(track);
            } else if (this.containsText(track.albumArtists, textToContain)) {
                filteredTracks.addTrack(track);
            } else if (this.containsText(track.artists, textToContain)) {
                filteredTracks.addTrack(track);
            } else if (this.containsText(track.fileName, textToContain)) {
                filteredTracks.addTrack(track);
            } else if (this.containsText(track.year.toString(), textToContain)) {
                filteredTracks.addTrack(track);
            }
        }

        return filteredTracks;
    }
}
