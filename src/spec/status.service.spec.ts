import * as assert from 'assert';
import { Subscription } from 'rxjs';
import { It, Times } from 'typemoq';
import { StatusMessage } from '../app/services/status/status-message';
import { StatusServiceMocker } from './mocking/status-service-mocker';

describe('StatusService', () => {
    describe('removingSongsAsync', () => {
        it('Should create a non-closable status message stating that songs are being removed', async () => {
            // Arrange
            const mocker: StatusServiceMocker = new StatusServiceMocker();
            mocker.translatorServiceMock.setup(x => x.getAsync('Status.RemovingSongs')).returns(async () => 'Removing songs');

            // Act
            await mocker.statusService.removingSongsAsync();

            // Assert
            mocker.statusMessageFactoryMock.verify(x => x.createNonDismissible('Removing songs'), Times.exactly(1));
        });
    });

    describe('updatingSongsAsync', () => {
        it('Should create a non-closable status message stating that songs are being updated', async () => {
            // Arrange
            const mocker: StatusServiceMocker = new StatusServiceMocker();
            mocker.translatorServiceMock.setup(x => x.getAsync('Status.UpdatingSongs')).returns(async () => 'Updating songs');

            // Act
            await mocker.statusService.updatingSongsAsync();

            // Assert
            mocker.statusMessageFactoryMock.verify(x => x.createNonDismissible('Updating songs'), Times.exactly(1));
        });
    });

    describe('addedSongsAsync', () => {
        it('Should create a non-closable status message stating that songs have been added', async () => {
            // Arrange
            const mocker: StatusServiceMocker = new StatusServiceMocker();

            mocker.translatorServiceMock.setup(x => x.getAsync('Status.AddedSongs', {
                numberOfAddedTracks: 10,
                percentageOfAddedTracks: 20
            })).returns(async () => 'Added 10 songs (20%)');

            // Act
            await mocker.statusService.addedSongsAsync(10, 20);

            // Assert
            mocker.statusMessageFactoryMock.verify(x => x.createNonDismissible('Added 10 songs (20%)'), Times.exactly(1));
        });
    });

    describe('newVersionAvailableAsync', () => {
        it('Should create a closable status message stating that a new version is available', async () => {
            // Arrange
            const mocker: StatusServiceMocker = new StatusServiceMocker();

            mocker.translatorServiceMock.setup(x => x.getAsync(
                'Status.NewVersionAvailable',
                { version: '2.0.0' }
            )).returns(async () => 'New version available: 2.0.0');

            // Act
            await mocker.statusService.newVersionAvailableAsync('2.0.0');

            // Assert
            mocker.statusMessageFactoryMock.verify(x => x.createDismissible('New version available: 2.0.0'), Times.exactly(1));
        });
    });

    describe('dismissStatusMessageAsync', () => {
        it('Should dismiss a non-dismissible status message', async () => {
            // Arrange
            const mocker: StatusServiceMocker = new StatusServiceMocker();

            mocker.schedulerMock.setup(x => x.sleepAsync(It.isAny())).returns(() => Promise.resolve());

            mocker.translatorServiceMock.setup(x => x.getAsync('Status.AddedSongs', {
                numberOfAddedTracks: 10,
                percentageOfAddedTracks: 20
            })).returns(async () => 'Added 10 songs (20%)');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(mocker.statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            await mocker.statusService.addedSongsAsync(10, 20);

            // Act
            await mocker.statusService.dismissStatusMessageAsync();

            // Assert
            assert.strictEqual(lastStatusMessage, undefined);
        });
    });

    describe('dismissGivenStatusMessage', () => {
        it('Should dismiss a dismissible status message', async () => {
            // Arrange
            const mocker: StatusServiceMocker = new StatusServiceMocker();

            mocker.translatorServiceMock.setup(x => x.getAsync(
                'Status.NewVersionAvailable',
                { version: '2.0.0' }
            )).returns(async () => 'New version available: 2.0.0');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(mocker.statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            await mocker.statusService.newVersionAvailableAsync('2.0.0');

            // Act
            await mocker.statusService.dismissGivenStatusMessage(lastStatusMessage);

            // Assert
            assert.strictEqual(lastStatusMessage, undefined);
        });
    });

    describe('getCurrentStatusMessage', () => {
        it('Should return undefined if there are no status messages', async () => {
            // Arrange
            const mocker: StatusServiceMocker = new StatusServiceMocker();

            // Act
            const currentStatusMessage: StatusMessage = await mocker.statusService.getCurrentStatusMessage();

            // Assert
            assert.strictEqual(currentStatusMessage, undefined);
        });

        it('Should return a non-dismissible status message if there is only a non-dismissible status message', async () => {
            // Arrange
            const mocker: StatusServiceMocker = new StatusServiceMocker();

            mocker.translatorServiceMock.setup(x => x.getAsync('Status.RemovingSongs')).returns(async () => 'Removing songs');
            mocker.statusMessageFactoryMock.setup(x => x.createNonDismissible('Removing songs')
            ).returns(() => new StatusMessage('Removing songs', false));

            await mocker.statusService.removingSongsAsync();

            // Act
            const currentStatusMessage: StatusMessage = await mocker.statusService.getCurrentStatusMessage();

            // Assert
            assert.ok(currentStatusMessage != undefined);
            assert.strictEqual(currentStatusMessage.message, 'Removing songs');
        });

        it('Should return a non-dismissible status message if there are non-dismissible and dismissible status messages', async () => {
            // Arrange
            const mocker: StatusServiceMocker = new StatusServiceMocker();

            mocker.translatorServiceMock.setup(x => x.getAsync('Status.RemovingSongs')).returns(async () => 'Removing songs');
            mocker.translatorServiceMock.setup(x => x.getAsync(
                'Status.NewVersionAvailable',
                { version: '2.0.0' }
            )).returns(async () => 'New version available: 2.0.0');

            mocker.statusMessageFactoryMock.setup(x => x.createNonDismissible('Removing songs')
            ).returns(() => new StatusMessage('Removing songs', false));

            mocker.statusMessageFactoryMock.setup(x => x.createDismissible('New version available: 2.0.0')
            ).returns(() => new StatusMessage('New version available: 2.0.0', true));

            await mocker.statusService.removingSongsAsync();
            await mocker.statusService.newVersionAvailableAsync('2.0.0');

            // Act
            const currentStatusMessage: StatusMessage = await mocker.statusService.getCurrentStatusMessage();

            // Assert
            assert.ok(currentStatusMessage != undefined);
            assert.strictEqual(currentStatusMessage.message, 'Removing songs');
        });

        it('Should return a dismissible status message if there are no non-dismissible status messages', async () => {
            // Arrange
            const mocker: StatusServiceMocker = new StatusServiceMocker();

            mocker.translatorServiceMock.setup(x => x.getAsync(
                'Status.NewVersionAvailable',
                { version: '2.0.0' }
            )).returns(async () => 'New version available: 2.0.0');

            mocker.statusMessageFactoryMock.setup(x => x.createDismissible('New version available: 2.0.0')
            ).returns(() => new StatusMessage('New version available: 2.0.0', true));

            await mocker.statusService.newVersionAvailableAsync('2.0.0');

            // Act
            const currentStatusMessage: StatusMessage = await mocker.statusService.getCurrentStatusMessage();

            // Assert
            assert.ok(currentStatusMessage != undefined);
            assert.strictEqual(currentStatusMessage.message, 'New version available: 2.0.0');
        });
    });
});
