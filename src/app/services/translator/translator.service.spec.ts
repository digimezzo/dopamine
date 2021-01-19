import { TranslateService } from '@ngx-translate/core';
import assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../core/settings/base-settings';
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
            assert.ok(service);
        });
    });
});
