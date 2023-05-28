import { NgZone } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { IMock, Mock } from 'typemoq';
import { Scheduler } from '../../common/scheduling/scheduler';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { SnackBarService } from './snack-bar.service';

jest.mock('@electron/remote', () => ({ exec: jest.fn() }));

describe('SnackBarService', () => {
    let zone: IMock<NgZone>;
    let matSnackBar: IMock<MatSnackBar>;
    let translatorService: IMock<BaseTranslatorService>;
    let scheduler: IMock<Scheduler>;

    let service: SnackBarService;

    beforeEach(() => {
        zone = Mock.ofType<NgZone>();
        matSnackBar = Mock.ofType<MatSnackBar>();
        translatorService = Mock.ofType<BaseTranslatorService>();
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
