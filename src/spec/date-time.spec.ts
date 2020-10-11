import * as assert from 'assert';
import { DateTime } from '../app/core/date-time';

describe('DateTime', () => {
    describe('getTicks', () => {
        it('Should return .NET ticks', () => {
            // Arrange
            const someDate: Date = new Date(2020, 10, 4, 15, 6, 4, 263);

            // Act
            const ticks: number = DateTime.getTicks(someDate);

            // Assert
            assert.strictEqual(ticks, 637400955642630000);
        });
    });
});
