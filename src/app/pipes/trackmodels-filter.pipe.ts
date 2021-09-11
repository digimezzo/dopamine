import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { TrackModels } from '../services/track/track-models';

@Pipe({ name: 'trackModelsFilter' })
export class TrackModelsFiltersPipe implements PipeTransform {
    constructor() {}

    public transform(trackModels: TrackModels, filterTerm: string): TrackModels {
        if (Strings.isNullOrWhiteSpace(filterTerm)) {
            return trackModels;
        }

        const filteredTracks: TrackModels = new TrackModels();

        for (const track of trackModels.tracks) {
            if (track.title.toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredTracks.addTrack(track);
            } else if (track.albumArtists.toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredTracks.addTrack(track);
            } else if (track.artists.toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredTracks.addTrack(track);
            } else if (track.fileName.toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredTracks.addTrack(track);
            } else if (track.year.toString().toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredTracks.addTrack(track);
            }
        }

        return filteredTracks;
    }
}
