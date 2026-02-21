import { TrackOrder, trackOrderKey } from './track-order';

describe('TrackOrder', () => {
    describe('trackOrderKey', () => {
        [
            [TrackOrder.byTrackTitleAscending, 'by-track-title-ascending'],
            [TrackOrder.byTrackTitleDescending, 'by-track-title-descending'],
            [TrackOrder.byDateCreatedAscending, 'oldest-first'],
            [TrackOrder.byDateCreatedDescending, 'newest-first'],
            [TrackOrder.byAlbum, 'by-album'],
            [TrackOrder.byRating, 'by-rating'],
            [TrackOrder.none, 'none'],
        ].forEach((pair) => {
            const trackOrder = pair[0] as TrackOrder;

            it(`should return track order key for ${trackOrder}`, () => {
                // Arrange
                const expectedTrackOrderKey = pair[1] as string;

                // Act
                const result = trackOrderKey(trackOrder);

                // Assert
                expect(result).toEqual(expectedTrackOrderKey);
            });
        });
    });
});
