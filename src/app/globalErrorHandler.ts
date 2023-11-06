import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrowserWindow } from 'electron';
import { Logger } from './common/logger';
import { ErrorDialogComponent } from './ui/components/dialogs/error-dialog/error-dialog.component';
import { ErrorData } from './services/dialog/error-data';
import { ApplicationBase } from './common/io/application.base';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    public constructor(
        private application: ApplicationBase,
        private logger: Logger,
        private dialog: MatDialog,
        private zone: NgZone,
    ) {}

    public handleError(e: Error): void {
        this.logger.error(e, 'Handling global error', 'GlobalErrorHandler', 'handleError');
        this.showGlobalErrorDialog();
    }

    public showGlobalErrorDialog(): void {
        this.logger.info('Showing global error dialog', 'GlobalErrorHandler', 'showGlobalErrorDialog');

        this.zone.run(() => {
            const dialogRef: MatDialogRef<ErrorDialogComponent> = this.dialog.open(ErrorDialogComponent, {
                // TranslationService is not able to provide the translation of texts in this class.
                // So we use a workaround where the translation happens in the error dialog itself.
                width: '450px',
                data: new ErrorData('', true),
            });

            dialogRef.afterClosed().subscribe(() => {
                // Quit the application
                this.logger.info('Closing application', 'GlobalErrorHandler', 'showGlobalErrorDialog');
                const win: BrowserWindow = this.application.getCurrentWindow();
                win.close();
            });
        });
    }
}
