const { TrackFieldCreator } = require('./track-field-creator');

describe('TrackFieldCreator', () => {
    let trackFieldCreator;

    beforeEach(() => {
        trackFieldCreator = new TrackFieldCreator();
    });

    describe('createNumberField', () => {
        it('should return an 0 when the given value is NaN', () => {
            // Arrange

            // Act
            const field = trackFieldCreator.createNumberField(NaN);

            // Assert
            expect(field).toEqual(0);
        });

        it('should return an 0 when the given value is undefined', () => {
            // Arrange

            // Act
            const field = trackFieldCreator.createNumberField(undefined);

            // Assert
            expect(field).toEqual(0);
        });

        it('should return the value when the given value is not null or undefined', () => {
            // Arrange

            // Act
            const field = trackFieldCreator.createNumberField(20);

            // Assert
            expect(field).toEqual(20);
        });
    });

    describe('createTextField', () => {
        it('should return an empty string when the given value is undefined', () => {
            // Arrange

            // Act
            const field = trackFieldCreator.createTextField(undefined);

            // Assert
            expect(field).toEqual('');
        });

        it('should return an empty string when the given value is empty', () => {
            // Arrange

            // Act
            const field = trackFieldCreator.createTextField('');

            // Assert
            expect(field).toEqual('');
        });

        it('should return the same value when the given value has no leading an trailing spaces', () => {
            // Arrange

            // Act
            const field = trackFieldCreator.createTextField('Valid value');

            // Assert
            expect(field).toEqual('Valid value');
        });

        it('should remove leading and trailing spaces from the given value', () => {
            // Arrange

            // Act
            const field = trackFieldCreator.createTextField('  Valid value ');

            // Assert
            expect(field).toEqual('Valid value');
        });
    });

    describe('createMultiTextField', () => {
        it('should return an empty string if the value array is undefined', () => {
            // Arrange

            // Act
            const field = trackFieldCreator.createMultiTextField(undefined);

            // Assert
            expect(field).toEqual('');
        });

        it('should convert to a delimited string', () => {
            // Arrange

            // Act
            const field = trackFieldCreator.createMultiTextField(['Item 1', 'Item 2']);

            // Assert
            expect(field).toEqual(';Item 1;;Item 2;');
        });
    });
});
