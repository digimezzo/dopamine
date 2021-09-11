import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { TrackModel } from '../services/track/track-model';

@Pipe({ name: 'tracksFilter' })
export class TracksFiltersPipe implements PipeTransform {
    constructor() {}

    public transform(tracks: TrackModel[], filterTerm: string): TrackModel[] {
        if (Strings.isNullOrWhiteSpace(filterTerm)) {
            return tracks;
        }

        const filteredTracks: TrackModel[] = [];

        for (const track of tracks) {
            if (track.title.toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredTracks.push(track);
            } else if (track.albumArtists.toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredTracks.push(track);
            } else if (track.artists.toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredTracks.push(track);
            } else if (track.fileName.toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredTracks.push(track);
            } else if (track.year.toString().toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredTracks.push(track);
            }
        }

        return filteredTracks;
    }
}
