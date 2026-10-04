import { QueryParts } from './query-parts';

const { QueryParts: WorkerQueryParts } = require('../../../main/background-work/data/query-parts');

describe.each([
    ['renderer', QueryParts],
    ['worker', WorkerQueryParts],
])('%s album artwork query', (_name, queryParts) => {
    it.each(['', '2', '3'])('should exclude blank album keys from the artwork join for index %p', (albumKeyIndex: string) => {
        const query: string = queryParts.selectAlbumDataQueryPart(albumKeyIndex, false);

        expect(query).toContain(`LEFT JOIN AlbumArtwork a ON t.AlbumKey${albumKeyIndex}=a.AlbumKey`);
        expect(query).toContain(`AND TRIM(t.AlbumKey${albumKeyIndex}) <> ''`);
    });
});