import * as assert from 'assert';
import { Times } from 'typemoq';
import { TrackFieldCreatorMocker } from './mocking/track-field-creator-mocker';

describe('TrackFieldCreator', () => {
    describe('createNumberField', () => {
        it('Should return an 0 when the given value is NaN', () => {
            // Arrange
            const mocker: TrackFieldCreatorMocker = new TrackFieldCreatorMocker();

            // Act
            const field: number = mocker.trackFieldCreator.createNumberField(NaN);

            // Assert
            assert.strictEqual(field, 0);
        });

        it('Should return an 0 when the given value is undefined', () => {
            // Arrange
            const mocker: TrackFieldCreatorMocker = new TrackFieldCreatorMocker();

            // Act
            const field: number = mocker.trackFieldCreator.createNumberField(undefined);

            // Assert
            assert.strictEqual(field, 0);
        });

        it('Should return the value when the given value is not null or undefined', () => {
            // Arrange
            const mocker: TrackFieldCreatorMocker = new TrackFieldCreatorMocker();

            // Act
            const field: number = mocker.trackFieldCreator.createNumberField(20);

            // Assert
            assert.strictEqual(field, 20);
        });
    });

    describe('createTextField', () => {
        it('Should return an empty string when the given value is undefined', () => {
            // Arrange
            const mocker: TrackFieldCreatorMocker = new TrackFieldCreatorMocker();

            // Act
            const field: string = mocker.trackFieldCreator.createTextField(undefined);

            // Assert
            assert.strictEqual(field, '');
        });

        it('Should return an empty string when the given value is empty', () => {
            // Arrange
            const mocker: TrackFieldCreatorMocker = new TrackFieldCreatorMocker();

            // Act
            const field: string = mocker.trackFieldCreator.createTextField('');

            // Assert
            assert.strictEqual(field, '');
        });

        it('Should return the same value when the given value has no leading an trailing spaces', () => {
            // Arrange
            const mocker: TrackFieldCreatorMocker = new TrackFieldCreatorMocker();

            // Act
            const field: string = mocker.trackFieldCreator.createTextField('Valid value');

            // Assert
            assert.strictEqual(field, 'Valid value');
        });

        it('Should remove leading and trailing spaces from the given value', () => {
            // Arrange
            const mocker: TrackFieldCreatorMocker = new TrackFieldCreatorMocker();

            // Act
            const field: string = mocker.trackFieldCreator.createTextField('  Valid value ');

            // Assert
            assert.strictEqual(field, 'Valid value');
        });
    });

    describe('createMultiTextField', () => {
        it('Should return an empty string if the value array is undefined', () => {
            // Arrange
            const mocker: TrackFieldCreatorMocker = new TrackFieldCreatorMocker();

            // Act
            const field: string = mocker.trackFieldCreator.createMultiTextField(undefined);

            // Assert
            assert.strictEqual(field, '');
        });

        it('Should join unsplittable metadata', () => {
            // Arrange
            const mocker: TrackFieldCreatorMocker = new TrackFieldCreatorMocker();

            mocker.metadataPatcherMock.setup(x => x.joinUnsplittableMetadata(['Item 1', 'Item 2'])).returns(() => ['Item 1', 'Item 2']);
            mocker.datadelimiterMock.setup(x => x.convertToDelimitedString(['Item 1', 'Item 2'])).returns(() => ';Item 1;;Item 2;');

            // Act
            const field: string = mocker.trackFieldCreator.createMultiTextField(['Item 1', 'Item 2']);

            // Assert
            mocker.metadataPatcherMock.verify(x => x.joinUnsplittableMetadata(['Item 1', 'Item 2']), Times.exactly(1));
        });

        it('Should convert to a delimited string', () => {
            // Arrange
            const mocker: TrackFieldCreatorMocker = new TrackFieldCreatorMocker();

            mocker.metadataPatcherMock.setup(x => x.joinUnsplittableMetadata(['Item 1', 'Item 2'])).returns(() => ['Item 1', 'Item 2']);
            mocker.datadelimiterMock.setup(x => x.convertToDelimitedString(['Item 1', 'Item 2'])).returns(() => ';Item 1;;Item 2;');

            // Act
            const field: string = mocker.trackFieldCreator.createMultiTextField(['Item 1', 'Item 2']);

            // Assert
            mocker.datadelimiterMock.verify(x => x.convertToDelimitedString(['Item 1', 'Item 2']), Times.exactly(1));
        });
    });
});
