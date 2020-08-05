import * as assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { DataDelimiter } from '../app/data/data-delimiter';
import { MetadataPatcher } from '../app/metadata/metadata-patcher';
import { TrackFieldCreator } from '../app/services/indexing/track-field-creator';

describe('TrackFieldCreator', () => {
    describe('createNumberField', () => {
        it('Should return an 0 when the given value is null', () => {
            // Arrange
            const metadataPatcherMock: IMock<MetadataPatcher> = Mock.ofType<MetadataPatcher>();
            const datadelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator(
                metadataPatcherMock.object,
                datadelimiterMock.object
            );

            // Act
            const field: number = trackFieldCreator.createNumberField(null);

            // Assert
            assert.strictEqual(field, 0);
        });

        it('Should return an 0 when the given value is undefined', () => {
            // Arrange
            const metadataPatcherMock: IMock<MetadataPatcher> = Mock.ofType<MetadataPatcher>();
            const datadelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator(
                metadataPatcherMock.object,
                datadelimiterMock.object
            );

            // Act
            const field: number = trackFieldCreator.createNumberField(undefined);

            // Assert
            assert.strictEqual(field, 0);
        });

        it('Should return the value when the given value is not null or undefined', () => {
            // Arrange
            const metadataPatcherMock: IMock<MetadataPatcher> = Mock.ofType<MetadataPatcher>();
            const datadelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator(
                metadataPatcherMock.object,
                datadelimiterMock.object
            );

            // Act
            const field: number = trackFieldCreator.createNumberField(20);

            // Assert
            assert.strictEqual(field, 20);
        });
    });

    describe('createTextField', () => {
        it('Should return an empty string when the given value is null', () => {
            // Arrange
            const metadataPatcherMock: IMock<MetadataPatcher> = Mock.ofType<MetadataPatcher>();
            const datadelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator(
                metadataPatcherMock.object,
                datadelimiterMock.object
            );

            // Act
            const field: string = trackFieldCreator.createTextField(null);

            // Assert
            assert.strictEqual(field, '');
        });

        it('Should return an empty string when the given value is undefined', () => {
            // Arrange
            const metadataPatcherMock: IMock<MetadataPatcher> = Mock.ofType<MetadataPatcher>();
            const datadelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator(
                metadataPatcherMock.object,
                datadelimiterMock.object
            );

            // Act
            const field: string = trackFieldCreator.createTextField(undefined);

            // Assert
            assert.strictEqual(field, '');
        });

        it('Should return an empty string when the given value is empty', () => {
            // Arrange
            const metadataPatcherMock: IMock<MetadataPatcher> = Mock.ofType<MetadataPatcher>();
            const datadelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator(
                metadataPatcherMock.object,
                datadelimiterMock.object
            );

            // Act
            const field: string = trackFieldCreator.createTextField('');

            // Assert
            assert.strictEqual(field, '');
        });

        it('Should return the same value when the given value has no leading an trailing spaces', () => {
            // Arrange
            const metadataPatcherMock: IMock<MetadataPatcher> = Mock.ofType<MetadataPatcher>();
            const datadelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator(
                metadataPatcherMock.object,
                datadelimiterMock.object
            );

            // Act
            const field: string = trackFieldCreator.createTextField('Valid value');

            // Assert
            assert.strictEqual(field, 'Valid value');
        });

        it('Should remove leading and trailing spaces from the given value', () => {
            // Arrange
            const metadataPatcherMock: IMock<MetadataPatcher> = Mock.ofType<MetadataPatcher>();
            const datadelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator(
                metadataPatcherMock.object,
                datadelimiterMock.object
            );

            // Act
            const field: string = trackFieldCreator.createTextField('  Valid value ');

            // Assert
            assert.strictEqual(field, 'Valid value');
        });
    });

    describe('createMultiTextField', () => {
        it('Should return an empty string if the value array is null', () => {
            // Arrange
            const metadataPatcherMock: IMock<MetadataPatcher> = Mock.ofType<MetadataPatcher>();
            const datadelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator(
                metadataPatcherMock.object,
                datadelimiterMock.object
            );

            // Act
            const field: string = trackFieldCreator.createMultiTextField(null);

            // Assert
            assert.strictEqual(field, '');
        });

        it('Should return an empty string if the value array is undefined', () => {
            // Arrange
            const metadataPatcherMock: IMock<MetadataPatcher> = Mock.ofType<MetadataPatcher>();
            const datadelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator(
                metadataPatcherMock.object,
                datadelimiterMock.object
            );

            // Act
            const field: string = trackFieldCreator.createMultiTextField(undefined);

            // Assert
            assert.strictEqual(field, '');
        });

        it('Should join unsplittable metadata', () => {
            // Arrange
            const metadataPatcherMock: IMock<MetadataPatcher> = Mock.ofType<MetadataPatcher>();
            const datadelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator(
                metadataPatcherMock.object,
                datadelimiterMock.object
            );

            metadataPatcherMock.setup(x => x.joinUnsplittableMetadata(['Item 1', 'Item 2'])).returns(() => ['Item 1', 'Item 2']);
            datadelimiterMock.setup(x => x.convertToDelimitedString(['Item 1', 'Item 2'])).returns(() => ';Item 1;;Item 2;');

            // Act
            const field: string = trackFieldCreator.createMultiTextField(['Item 1', 'Item 2']);

            // Assert
            metadataPatcherMock.verify(x => x.joinUnsplittableMetadata(['Item 1', 'Item 2']), Times.exactly(1));
        });

        it('Should convert to a delimited string', () => {
            // Arrange
            const metadataPatcherMock: IMock<MetadataPatcher> = Mock.ofType<MetadataPatcher>();
            const datadelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const trackFieldCreator: TrackFieldCreator = new TrackFieldCreator(
                metadataPatcherMock.object,
                datadelimiterMock.object
            );

            metadataPatcherMock.setup(x => x.joinUnsplittableMetadata(['Item 1', 'Item 2'])).returns(() => ['Item 1', 'Item 2']);
            datadelimiterMock.setup(x => x.convertToDelimitedString(['Item 1', 'Item 2'])).returns(() => ';Item 1;;Item 2;');

            // Act
            const field: string = trackFieldCreator.createMultiTextField(['Item 1', 'Item 2']);

            // Assert
            datadelimiterMock.verify(x => x.convertToDelimitedString(['Item 1', 'Item 2']), Times.exactly(1));
        });
    });
});
