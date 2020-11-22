import * as assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { StatusPanelComponent } from '../app/components/status-panel/status-panel.component';
import { Scheduler } from '../app/core/scheduler/scheduler';
import { BaseStatusService } from '../app/services/status/base-status.service';
import { StatusMessage } from '../app/services/status/status-message';
import { StatusMessageFactory } from '../app/services/status/status-message-factory';
import { StatusService } from '../app/services/status/status.service';
import { BaseTranslatorService } from '../app/services/translator/base-translator.service';

describe('StatusPanelComponent', () => {
    describe('constructor', () => {
        it('Should set statusService', () => {
            // Arrange
            const statusServiceMock: IMock<BaseStatusService> = Mock.ofType<BaseStatusService>();

            // Act
            const statusPanelComponent: StatusPanelComponent = new StatusPanelComponent(statusServiceMock.object);

            // Assert
            assert.ok(statusPanelComponent.statusService != undefined);
        });
    });

    describe('constructor', () => {
        it('Should set visibility hidden', () => {
            // Arrange
            const statusServiceMock: IMock<BaseStatusService> = Mock.ofType<BaseStatusService>();

            // Act
            const statusPanelComponent: StatusPanelComponent = new StatusPanelComponent(statusServiceMock.object);

            // Assert
            assert.strictEqual(statusPanelComponent.visibility, 'hidden');
        });
    });

    describe('dismiss', () => {
        it('Should dismiss a dismissible status message', () => {
            // Arrange
            const statusServiceMock: IMock<BaseStatusService> = Mock.ofType<BaseStatusService>();
            const statusPanelComponent: StatusPanelComponent = new StatusPanelComponent(statusServiceMock.object);
            const statusMessage: StatusMessage = new StatusMessage('My dismissible message', true);

            // Act
            statusPanelComponent.dismiss(statusMessage);

            // Assert
            statusServiceMock.verify(x => x.dismissGivenStatusMessage(statusMessage), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('Should listen to status messages', async () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
            const statusMessageFactoryMock: IMock<StatusMessageFactory> = Mock.ofType<StatusMessageFactory>();

            statusMessageFactoryMock.setup(x => x.createNonDismissible('Removing songs')
            ).returns(() => new StatusMessage('Removing songs', false));

            const statusService: BaseStatusService = new StatusService(
                translatorServiceMock.object,
                schedulerMock.object,
                statusMessageFactoryMock.object
            );
            const statusPanelComponent: StatusPanelComponent = new StatusPanelComponent(statusService);

            translatorServiceMock.setup(x => x.getAsync('Status.RemovingSongs')).returns(async () => 'Removing songs');

            // Act
            await statusPanelComponent.ngOnInit();
            await statusService.removingSongsAsync();

            // Assert
            assert.strictEqual(statusPanelComponent.statusMessage.message, 'Removing songs');
        });
    });
});
