import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { NotificationPanelComponent } from '../app/components/notification-panel/notification-panel.component';
import { BaseNotificationService } from '../app/services/notification/base-notifcation.service';

describe('NotificationPanelComponent', () => {
    describe('constructor', () => {
        it('Should set appearanceService', () => {
            // Arrange
            const notificationServiceMock: IMock<BaseNotificationService> = Mock.ofType<BaseNotificationService>();

            // Act
            const notificationPanelComponent: NotificationPanelComponent = new NotificationPanelComponent(
                notificationServiceMock.object,
            );

            // Assert
            assert.ok(notificationPanelComponent.notificationService != undefined);
        });
    });
});
