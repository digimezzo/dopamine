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
            const textToSearch = [
                track.title,
                track.albumTitle,
                track.albumArtists,
                track.artists,
                track.fileName,
                track.year.toString(),
                track.genres,
            ].join(' ');

            if (this.searchService.matchesSearchText(textToSearch, textToContain!)) {
                filteredTracks.addTrack(track);
            }
        }

        return filteredTracks;
    }
}
