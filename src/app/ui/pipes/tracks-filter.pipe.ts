import { Pipe, PipeTransform } from '@angular/core';
import { TrackModels } from '../../services/track/track-models';
import { StringUtils } from '../../common/utils/string-utils';
import { SearchServiceBase } from '../../services/search/search.service.base';

@Pipe({ name: 'tracksFilter' })
export class TracksFilterPipe implements PipeTransform {
    public constructor(private searchService: SearchServiceBase) {}

    public transform(tracks: TrackModels, textToContain: string | undefined): TrackModels {
        if (StringUtils.isNullOrWhiteSpace(textToContain)) {
            return tracks;
        }

        const filteredTracks: TrackModels = new TrackModels();

        for (const track of tracks.tracks) {
            if (this.searchService.matchesSearchText(track.title, textToContain!)) {
                filteredTracks.addTrack(track);
            } else if (this.searchService.matchesSearchText(track.albumArtists, textToContain!)) {
                filteredTracks.addTrack(track);
            } else if (this.searchService.matchesSearchText(track.artists, textToContain!)) {
                filteredTracks.addTrack(track);
            } else if (this.searchService.matchesSearchText(track.fileName, textToContain!)) {
                filteredTracks.addTrack(track);
            } else if (this.searchService.matchesSearchText(track.year.toString(), textToContain!)) {
                filteredTracks.addTrack(track);
            } else if (this.searchService.matchesSearchText(track.genres, textToContain!)) {
                filteredTracks.addTrack(track);
            }
        }

        return filteredTracks;
    }
}
