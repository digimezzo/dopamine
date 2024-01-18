import { IMock, Mock } from 'typemoq';
import { Scheduler } from '../../common/scheduling/scheduler';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { NotificationServiceBase } from './notification.service.base';
import { NotificationService } from './notification.service';

describe('SnackBarService', () => {
    let translatorService: IMock<TranslatorServiceBase>;
    let scheduler: IMock<Scheduler>;

    beforeEach(() => {
        translatorService = Mock.ofType<TranslatorServiceBase>();
        scheduler = Mock.ofType<Scheduler>();
    });

    function createrSut(): NotificationServiceBase {
        return new NotificationService(translatorService.object, scheduler.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Arrange, Act
            const sut: NotificationServiceBase = createrSut();

            // Assert
            expect(sut).toBeDefined();
        });
    });

    test.todo('should write tests');
});
