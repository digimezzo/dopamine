import * as assert from 'assert';
import { Subscription } from 'rxjs';
import { IMock, It, Mock } from 'typemoq';
import { Scheduler } from '../app/core/scheduler/scheduler';
import { StatusMessage } from '../app/services/status/status-message';
import { StatusService } from '../app/services/status/status.service';
import { BaseTranslatorService } from '../app/services/translator/base-translator.service';

describe('StatusService', () => {
    describe('removingSongsAsync', () => {
        it('Should notify that songs are being removed in a non-dismissable way', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            translatorServiceMock.setup(x => x.getAsync('Status.RemovingSongs')).returns(async () => 'Removing songs');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            // Act
            await statusService.removingSongsAsync();

            // Assert
            assert.strictEqual(lastStatusMessage.message, 'Removing songs');
            assert.strictEqual(lastStatusMessage.isDismissable, false);
        });

        it('Should override a non-dismissable status message', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            translatorServiceMock.setup(x => x.getAsync('Status.RemovingSongs')).returns(async () => 'Removing songs');
            translatorServiceMock.setup(x => x.getAsync(
                'Status.NewVersionAvailable',
                { version: '2.0.0' }
            )).returns(async () => 'New version available: 2.0.0');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            await statusService.newVersionAvailableAsync('2.0.0');

            // Act
            await statusService.removingSongsAsync();

            // Assert
            assert.strictEqual(lastStatusMessage.message, 'Removing songs');
            assert.strictEqual(lastStatusMessage.isDismissable, false);
        });

        it('Should override dismissable status message', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            translatorServiceMock.setup(x => x.getAsync('Status.UpdatingSongs')).returns(async () => 'Updating songs');
            translatorServiceMock.setup(x => x.getAsync('Status.RemovingSongs')).returns(async () => 'Removing songs');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            await statusService.updatingSongsAsync();

            // Act
            await statusService.removingSongsAsync();

            // Assert
            assert.strictEqual(lastStatusMessage.message, 'Removing songs');
            assert.strictEqual(lastStatusMessage.isDismissable, false);
        });
    });

    describe('updatingSongsAsync', () => {
        it('Should notify that songs are being updated in a non-dismissable way', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            translatorServiceMock.setup(x => x.getAsync('Status.UpdatingSongs')).returns(async () => 'Updating songs');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            // Act
            await statusService.updatingSongsAsync();

            // Assert
            assert.strictEqual(lastStatusMessage.message, 'Updating songs');
            assert.strictEqual(lastStatusMessage.isDismissable, false);
        });

        it('Should override a non-dismissable status message', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            translatorServiceMock.setup(x => x.getAsync('Status.UpdatingSongs')).returns(async () => 'Updating songs');
            translatorServiceMock.setup(x => x.getAsync(
                'Status.NewVersionAvailable',
                { version: '2.0.0' }
            )).returns(async () => 'New version available: 2.0.0');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            await statusService.newVersionAvailableAsync('2.0.0');

            // Act
            await statusService.updatingSongsAsync();

            // Assert
            assert.strictEqual(lastStatusMessage.message, 'Updating songs');
            assert.strictEqual(lastStatusMessage.isDismissable, false);
        });

        it('Should override dismissable status message', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            translatorServiceMock.setup(x => x.getAsync('Status.RemovingSongs')).returns(async () => 'Removing songs');
            translatorServiceMock.setup(x => x.getAsync('Status.UpdatingSongs')).returns(async () => 'Updating songs');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            await statusService.removingSongsAsync();

            // Act
            await statusService.updatingSongsAsync();

            // Assert
            assert.strictEqual(lastStatusMessage.message, 'Updating songs');
            assert.strictEqual(lastStatusMessage.isDismissable, false);
        });
    });

    describe('addedSongsAsync', () => {
        it('Should notify that songs have been added in a non-dismissable way', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            translatorServiceMock.setup(x => x.getAsync('Status.AddedSongs', {
                numberOfAddedTracks: 10,
                percentageOfAddedTracks: 20
            })).returns(async () => 'Added 10 songs (20%)');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            // Act
            await statusService.addedSongsAsync(10, 20);

            // Assert
            assert.strictEqual(lastStatusMessage.message, 'Added 10 songs (20%)');
            assert.strictEqual(lastStatusMessage.isDismissable, false);
        });

        it('Should override a non-dismissable status message', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            translatorServiceMock.setup(x => x.getAsync('Status.AddedSongs', {
                numberOfAddedTracks: 10,
                percentageOfAddedTracks: 20
            })).returns(async () => 'Added 10 songs (20%)');

            translatorServiceMock.setup(x => x.getAsync(
                'Status.NewVersionAvailable',
                { version: '2.0.0' }
            )).returns(async () => 'New version available: 2.0.0');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            await statusService.newVersionAvailableAsync('2.0.0');

            // Act
            await statusService.addedSongsAsync(10, 20);

            // Assert
            assert.strictEqual(lastStatusMessage.message, 'Added 10 songs (20%)');
            assert.strictEqual(lastStatusMessage.isDismissable, false);
        });

        it('Should override dismissable status message', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            translatorServiceMock.setup(x => x.getAsync('Status.RemovingSongs')).returns(async () => 'Removing songs');

            translatorServiceMock.setup(x => x.getAsync('Status.AddedSongs', {
                numberOfAddedTracks: 10,
                percentageOfAddedTracks: 20
            })).returns(async () => 'Added 10 songs (20%)');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            await statusService.removingSongsAsync();

            // Act
            await statusService.addedSongsAsync(10, 20);

            // Assert
            assert.strictEqual(lastStatusMessage.message, 'Added 10 songs (20%)');
            assert.strictEqual(lastStatusMessage.isDismissable, false);
        });
    });

    describe('newVersionAvailableAsync', () => {
        it('Should notify that a new version is available in a dismissable way', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            translatorServiceMock.setup(x => x.getAsync(
                'Status.NewVersionAvailable',
                { version: '2.0.0' }
            )).returns(async () => 'New version available: 2.0.0');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            // Act
            await statusService.newVersionAvailableAsync('2.0.0');

            // Assert
            assert.strictEqual(lastStatusMessage.message, 'New version available: 2.0.0');
            assert.strictEqual(lastStatusMessage.isDismissable, true);
        });

        it('Should not override a non-dismissable status message', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            translatorServiceMock.setup(x => x.getAsync('Status.RemovingSongs')).returns(async () => 'Removing songs');

            translatorServiceMock.setup(x => x.getAsync(
                'Status.NewVersionAvailable',
                { version: '2.0.0' }
            )).returns(async () => 'New version available: 2.0.0');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            await statusService.removingSongsAsync();

            // Act
            await statusService.newVersionAvailableAsync('2.0.0');

            // Assert
            assert.strictEqual(lastStatusMessage.message, 'Removing songs');
            assert.strictEqual(lastStatusMessage.isDismissable, false);
        });

        it('Should override a dismissable status message', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            translatorServiceMock.setup(x => x.getAsync(
                'Status.NewVersionAvailable',
                { version: '1.0.0' }
            )).returns(async () => 'New version available: 1.0.0');

            translatorServiceMock.setup(x => x.getAsync(
                'Status.NewVersionAvailable',
                { version: '2.0.0' }
            )).returns(async () => 'New version available: 2.0.0');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            await statusService.newVersionAvailableAsync('1.0.0');

            // Act
            await statusService.newVersionAvailableAsync('2.0.0');

            // Assert
            assert.strictEqual(lastStatusMessage.message, 'New version available: 2.0.0');
            assert.strictEqual(lastStatusMessage.isDismissable, true);
        });
    });

    describe('dismissNonDismissableStatusMessageAsync', () => {
        it('Should dismiss a non-dismissable status message', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            schedulerMock.setup(x => x.sleepAsync(It.isAny())).returns(() => Promise.resolve());

            translatorServiceMock.setup(x => x.getAsync('Status.AddedSongs', {
                numberOfAddedTracks: 10,
                percentageOfAddedTracks: 20
            })).returns(async () => 'Added 10 songs (20%)');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            await statusService.addedSongsAsync(10, 20);

            // Act
            await statusService.dismissNonDismissableStatusMessageAsync();

            // Assert
            assert.strictEqual(lastStatusMessage, undefined);
        });
    });

    describe('dismissDismissableStatusMessage', () => {
        it('Should dismiss a dismissable status message', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusService: StatusService = new StatusService(translatorServiceMock.object, schedulerMock.object);

            translatorServiceMock.setup(x => x.getAsync(
                'Status.NewVersionAvailable',
                { version: '2.0.0' }
            )).returns(async () => 'New version available: 2.0.0');

            const subscription: Subscription = new Subscription();

            let lastStatusMessage: StatusMessage;

            subscription.add(statusService.statusMessage$.subscribe((statusMessage) => {
                lastStatusMessage = statusMessage;
            }));

            await statusService.newVersionAvailableAsync('2.0.0');

            // Act
            await statusService.dismissDismissableStatusMessage(lastStatusMessage);

            // Assert
            assert.strictEqual(lastStatusMessage, undefined);
        });
    });
});
