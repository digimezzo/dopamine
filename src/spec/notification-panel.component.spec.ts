import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { StatusPanelComponent } from '../app/components/status-panel/status-panel.component';
import { BaseStatusService } from '../app/services/status/base-status.service';

describe('StatusPanelComponent', () => {
    describe('constructor', () => {
        it('Should set statusService', () => {
            // Arrange
            const statusServiceMock: IMock<BaseStatusService> = Mock.ofType<BaseStatusService>();

            // Act
            const statusPanelComponent: StatusPanelComponent = new StatusPanelComponent(
                statusServiceMock.object,
            );

            // Assert
            assert.ok(statusPanelComponent.statusService != undefined);
        });
    });
});
