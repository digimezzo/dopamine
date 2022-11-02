import { TracksColumnsOrder } from './tracks-columns-order';
import { TracksColumnsOrderColumn } from './tracks-columns-order-column';
import { TracksColumnsOrderDirection } from './tracks-columns-order-direction';

describe('TracksColumnsOrder', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const tracksColumnsOrder: TracksColumnsOrder = new TracksColumnsOrder(
                TracksColumnsOrderColumn.album,
                TracksColumnsOrderDirection.ascending
            );

            // Assert
            expect(tracksColumnsOrder).toBeDefined();
        });

        it('should set tracksColumnsOrderColumn', () => {
            // Arrange

            // Act
            const tracksColumnsOrder: TracksColumnsOrder = new TracksColumnsOrder(
                TracksColumnsOrderColumn.album,
                TracksColumnsOrderDirection.ascending
            );

            // Assert
            expect(tracksColumnsOrder.tracksColumnsOrderColumn).toEqual(TracksColumnsOrderColumn.album);
        });

        it('should set tracksColumnsOrderDirection', () => {
            // Arrange

            // Act
            const tracksColumnsOrder: TracksColumnsOrder = new TracksColumnsOrder(
                TracksColumnsOrderColumn.album,
                TracksColumnsOrderDirection.ascending
            );

            // Assert
            expect(tracksColumnsOrder.tracksColumnsOrderDirection).toEqual(TracksColumnsOrderDirection.ascending);
        });
    });
});
