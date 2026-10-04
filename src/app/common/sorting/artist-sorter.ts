import { Injectable } from '@angular/core';
import { ArtistModel } from '../../services/artist/artist-model';
import { Timer } from '../scheduling/timer';
import { sort } from 'fast-sort';
import { Logger } from '../logger';
import { Constants } from '../application/constants';

@Injectable({ providedIn: 'root' })
export class ArtistSorter {
    private readonly collator: Intl.Collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    private readonly compare = this.collator.compare.bind(this.collator) as (a: string, b: string) => number;

    public constructor(private logger: Logger) {}

    public sortAscending(artists: ArtistModel[] = []): ArtistModel[] {
        return this.sortArtists(artists, true);
    }

    public sortDescending(artists: ArtistModel[] = []): ArtistModel[] {
        return this.sortArtists(artists, false);
    }

    private sortArtists(artists: ArtistModel[], ascending: boolean): ArtistModel[] {
        if (artists.length === 0) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const keyedArtists = artists.map((artist) => {
            const sortableName = artist.sortableName;
            const firstCharacter = sortableName.charAt(0);
            const zoomHeader = Constants.alphabeticalHeaders.includes(firstCharacter) ? firstCharacter : '#';
            return { artist, sortableName, zoomHeader };
        });
        const ordered = ascending
            ? sort(keyedArtists).by([
                  { asc: (item) => item.zoomHeader, comparer: this.compare },
                  { asc: (item) => item.sortableName, comparer: this.compare },
              ])
            : sort(keyedArtists).by([
                  { desc: (item) => item.zoomHeader, comparer: this.compare },
                  { desc: (item) => item.sortableName, comparer: this.compare },
              ]);
        const sorted = ordered.map((item) => item.artist);

        timer.stop();

        this.logger.info(
            `Finished sorting artists ${ascending ? 'ascending' : 'descending'}. Time required: ${timer.elapsedMilliseconds} ms`,
            'ArtistSorter',
            'sortArtists',
        );

        return sorted;
    }
}
