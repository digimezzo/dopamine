const { QueryParts } = require('./query-parts');

describe('QueryParts', () => {
    describe('selectTracksQueryPart', () => {
        it('should read rating from the same column that updateTrack writes to', () => {
            const query = QueryParts.selectTracksQueryPart(false);

            expect(query).toContain('t.NewRating AS rating');
            expect(query).not.toMatch(/t\.Rating AS rating/);
        });
    });
});
