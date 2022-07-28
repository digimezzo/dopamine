import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { BaseSearchService } from '../services/search/base-search.service';
import { TrackModels } from '../services/track/track-models';

@Pipe({ name: 'tracksFilter' })
export class TracksFilterPipe implements PipeTransform {
    constructor(private searchService: BaseSearchService) {}

    public transform(tracks: TrackModels, textToContain: string): TrackModels {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return tracks;
        }

        const filteredTracks: TrackModels = new TrackModels();

        for (const track of tracks.tracks) {
            if (this.searchService.matchesSearchText(track.title, textToContain)) {
                filteredTracks.addTrack(track);
            } else if (this.searchService.matchesSearchText(track.albumArtists, textToContain)) {
                filteredTracks.addTrack(track);
            } else if (this.searchService.matchesSearchText(track.artists, textToContain)) {
                filteredTracks.addTrack(track);
            } else if (this.searchService.matchesSearchText(track.fileName, textToContain)) {
                filteredTracks.addTrack(track);
            } else if (this.searchService.matchesSearchText(track.year.toString(), textToContain)) {
                filteredTracks.addTrack(track);
            }
        }

        return filteredTracks;
    }
}
