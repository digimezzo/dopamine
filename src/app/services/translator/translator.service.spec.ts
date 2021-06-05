import { TranslateService } from '@ngx-translate/core';
import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../common/settings/base-settings';
import { TranslatorService } from './translator.service';

describe('TranslatorService', () => {
    let translateMock: IMock<TranslateService>;
    let settingsMock: IMock<BaseSettings>;

    let service: TranslatorService;

    beforeEach(() => {
        translateMock = Mock.ofType<TranslateService>();
        settingsMock = Mock.ofType<BaseSettings>();

        service = new TranslatorService(translateMock.object, settingsMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });
});
