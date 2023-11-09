import { NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IMock, Mock } from 'typemoq';
import { Scheduler } from '../../common/scheduling/scheduler';
import { SnackBarService } from './snack-bar.service';
import { TranslatorServiceBase } from '../translator/translator.service.base';

jest.mock('@electron/remote', () => ({ exec: jest.fn() }));

describe('SnackBarService', () => {
    let zone: IMock<NgZone>;
    let matSnackBar: IMock<MatSnackBar>;
    let translatorService: IMock<TranslatorServiceBase>;
    let scheduler: IMock<Scheduler>;

    let service: SnackBarService;

    beforeEach(() => {
        zone = Mock.ofType<NgZone>();
        matSnackBar = Mock.ofType<MatSnackBar>();
        translatorService = Mock.ofType<TranslatorServiceBase>();
        scheduler = Mock.ofType<Scheduler>();

        service = new SnackBarService(zone.object, matSnackBar.object, translatorService.object, scheduler.object);
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
