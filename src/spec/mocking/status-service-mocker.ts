import { IMock, Mock } from 'typemoq';
import { Scheduler } from '../../app/core/scheduler/scheduler';
import { StatusMessageFactory } from '../../app/services/status/status-message-factory';
import { StatusService } from '../../app/services/status/status.service';
import { BaseTranslatorService } from '../../app/services/translator/base-translator.service';

export class StatusServiceMocker {
    constructor() {
        this.statusService = new StatusService(
            this.translatorServiceMock.object,
            this.schedulerMock.object,
            this.statusMessageFactoryMock.object);
    }

    public translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
    public schedulerMock: IMock<Scheduler> = Mock.ofType<Scheduler>();
    public statusMessageFactoryMock: IMock<StatusMessageFactory> = Mock.ofType<StatusMessageFactory>();
    public statusService: StatusService;
}
