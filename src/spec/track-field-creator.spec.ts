import * as assert from 'assert';
import { TrackFieldCreator } from '../app/services/indexing/track-field-creator';

describe('TrackFieldCreator', () => {
    describe('convertToSingleValueField', () => {
        it('Should return an empty string when the given value is null', () => {
            // Arrange
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator();

            // Act
            const field: string = trackFieldCreator.convertToSingleValueField(null);

            // Assert
            assert.strictEqual(field, '');
        });

        it('Should return an empty string when the given value is undefined', () => {
            // Arrange
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator();

            // Act
            const field: string = trackFieldCreator.convertToSingleValueField(undefined);

            // Assert
            assert.strictEqual(field, '');
        });

        it('Should return an empty string when the given value is empty', () => {
            // Arrange
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator();

            // Act
            const field: string = trackFieldCreator.convertToSingleValueField('');

            // Assert
            assert.strictEqual(field, '');
        });

        it('Should return the same value when the given value has no leading an trailing spaces', () => {
            // Arrange
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator();

            // Act
            const field: string = trackFieldCreator.convertToSingleValueField('Valid value');

            // Assert
            assert.strictEqual(field, 'Valid value');
        });

        it('Should remove leading and trailing spaces from the given value', () => {
            // Arrange
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator();

            // Act
            const field: string = trackFieldCreator.convertToSingleValueField('  Valid value ');

            // Assert
            assert.strictEqual(field, 'Valid value');
        });
    });

    describe('convertToMultiValueField', () => {
        it('Should join unsplittable metadata', () => {
            // Arrange


            // Act


            // Assert

        });

        it('Should convert to a delimited string', () => {
            // Arrange


            // Act


            // Assert

        });
    });
});
