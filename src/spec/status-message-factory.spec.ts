import * as assert from 'assert';
import { StatusMessage } from '../app/services/status/status-message';
import { StatusMessageFactory } from '../app/services/status/status-message-factory';

describe('StatusMessageFactory', () => {
    describe('createDismissible', () => {
        it('Should create a dismissible notification', () => {
            // Arrange
            const factory: StatusMessageFactory = new StatusMessageFactory();

            // Act
            const statusMessage: StatusMessage = factory.createDismissible('My message');

            // Assert
            assert.strictEqual(statusMessage.isDismissible, true);
        });

        it('Should create a notification that uses the given message', () => {
            // Arrange
            const factory: StatusMessageFactory = new StatusMessageFactory();

            // Act
            const statusMessage: StatusMessage = factory.createDismissible('My message');

            // Assert
            assert.strictEqual(statusMessage.message, 'My message');
        });
    });

    describe('createNonDismissible', () => {
        it('Should create a non-dismissible notification', () => {
            // Arrange
            const factory: StatusMessageFactory = new StatusMessageFactory();

            // Act
            const statusMessage: StatusMessage = factory.createNonDismissible('My message');

            // Assert
            assert.strictEqual(statusMessage.isDismissible, false);
        });

        it('Should create a notification that uses the given message', () => {
            // Arrange
            const factory: StatusMessageFactory = new StatusMessageFactory();

            // Act
            const statusMessage: StatusMessage = factory.createNonDismissible('My message');

            // Assert
            assert.strictEqual(statusMessage.message, 'My message');
        });
    });
});
