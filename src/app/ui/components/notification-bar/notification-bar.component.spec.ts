import { IMock, Mock, Times } from 'typemoq';
import { NotificationBarComponent } from './notification-bar.component';
import { NotificationServiceBase } from '../../../services/notification/notification.service.base';
import { DocumentProxy } from '../../../common/io/document-proxy';
import { SchedulerBase } from '../../../common/scheduling/scheduler.base';
import { NotificationData } from '../../../services/notification/notification-data';
import { Observable, Subject } from 'rxjs';

describe('NotificationBarComponent', () => {
    let component: NotificationBarComponent;

    let notificationServiceMock: IMock<NotificationServiceBase>;
    let documentProxyMock: IMock<DocumentProxy>;
    let schedulerMock: IMock<SchedulerBase>;

    let notificationService_showNotification: Subject<NotificationData>;
    let notificationService_dismissNotification: Subject<void>;

    let divElementMock: HTMLDivElement;

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        documentProxyMock = Mock.ofType<DocumentProxy>();
        schedulerMock = Mock.ofType<SchedulerBase>();

        divElementMock = document.createElement('div');
        documentProxyMock.setup((x) => x.getDocumentElement()).returns(() => divElementMock);

        notificationService_showNotification = new Subject();
        const notificationService_showNotification$: Observable<NotificationData> = notificationService_showNotification.asObservable();
        notificationServiceMock.setup((x) => x.showNotification$).returns(() => notificationService_showNotification$);

        notificationService_dismissNotification = new Subject();
        const notificationService_dismissNotification$: Observable<void> = notificationService_dismissNotification.asObservable();
        notificationServiceMock.setup((x) => x.dismissNotification$).returns(() => notificationService_dismissNotification$);
    });

    function createSut(): NotificationBarComponent {
        return new NotificationBarComponent(notificationServiceMock.object, documentProxyMock.object, schedulerMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const sut: NotificationBarComponent = createSut();

            // Assert
            expect(sut).toBeDefined();
        });
    });

    describe('isExpanded', () => {
        it('should be false by default', () => {
            // Arrange, Act
            const sut: NotificationBarComponent = createSut();

            // Assert
            expect(sut.isExpanded).toBeFalsy();
        });
    });

    describe('notificationData', () => {
        it('should be undefined by default', () => {
            // Arrange, Act
            const sut: NotificationBarComponent = createSut();

            // Assert
            expect(sut.notificationData).toBeUndefined();
        });
    });

    describe('dismiss', () => {
        it('should dismiss via notificationService', () => {
            // Arrange
            const sut: NotificationBarComponent = createSut();

            // Act
            sut.dismiss();

            // Assert
            notificationServiceMock.verify((x) => x.dismiss(), Times.once());
        });
    });

    describe('ngOnInit', () => {
        it('should not show notification if there is no notification on the service', () => {
            // Arrange
            const notificationData: NotificationData = new NotificationData('icon', 'message', true, true);
            notificationServiceMock.setup((x) => x.notificationData).returns(() => notificationData);
            notificationServiceMock.setup((x) => x.hasNotificationData).returns(() => true);

            const sut: NotificationBarComponent = createSut();

            // Act
            sut.ngOnInit();

            // Assert
            expect(sut.notificationData).toBe(notificationData);
            expect(sut.isExpanded).toBeTruthy();
            expect(divElementMock.style.getPropertyValue('--notification-bar-correction')).toBe('30px');
        });

        it('should show notification if there is a notification on the service', () => {
            // Arrange
            notificationServiceMock.setup((x) => x.notificationData).returns(() => undefined);
            notificationServiceMock.setup((x) => x.hasNotificationData).returns(() => false);

            const sut: NotificationBarComponent = createSut();

            // Act
            sut.ngOnInit();

            // Assert
            expect(sut.notificationData).toBeUndefined();
            expect(sut.isExpanded).toBeFalsy();
            expect(divElementMock.style.getPropertyValue('--notification-bar-correction')).toBe('');
        });
    });

    describe('notificationService.showNotification$', () => {
        it('should show notification', () => {
            // Arrange
            const notificationData: NotificationData = new NotificationData('icon', 'message', true, true);
            notificationServiceMock.setup((x) => x.notificationData).returns(() => undefined);
            notificationServiceMock.setup((x) => x.hasNotificationData).returns(() => false);

            const sut: NotificationBarComponent = createSut();

            // Act
            sut.ngOnInit();
            notificationService_showNotification.next(notificationData);

            // Assert
            expect(sut.notificationData).toBe(notificationData);
            expect(sut.isExpanded).toBeTruthy();
            expect(divElementMock.style.getPropertyValue('--notification-bar-correction')).toBe('30px');
        });
    });

    describe('notificationService.dismissNotification$', () => {
        it('should dismiss notification', async () => {
            // Arrange
            const notificationData: NotificationData = new NotificationData('icon', 'message', true, true);
            notificationServiceMock.setup((x) => x.notificationData).returns(() => notificationData);
            notificationServiceMock.setup((x) => x.hasNotificationData).returns(() => true);

            const sut: NotificationBarComponent = createSut();

            // Act
            sut.ngOnInit();
            notificationService_dismissNotification.next();
            await flushPromises();

            // Assert
            expect(sut.notificationData).toBeUndefined();
            expect(sut.isExpanded).toBeFalsy();
            expect(divElementMock.style.getPropertyValue('--notification-bar-correction')).toBe('0px');
            schedulerMock.verify((x) => x.sleepAsync(150), Times.once());
        });
    });
});
