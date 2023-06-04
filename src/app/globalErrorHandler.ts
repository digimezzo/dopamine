import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { BrowserWindow } from 'electron';
import { BaseApplication } from './common/io/base-application';
import { Logger } from './common/logger';
import { ErrorDialogComponent } from './components/dialogs/error-dialog/error-dialog.component';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private application: BaseApplication, private logger: Logger, private dialog: MatDialog, private zone: NgZone) {}

    public handleError(e: Error): void {
        this.logger.error(`Handling global error. Error: ${e.message}.`, 'GlobalErrorHandler', 'handleError');
        this.showGlobalErrorDialog();
    }

    public showGlobalErrorDialog(): void {
        this.logger.info('Showing global error dialog', 'GlobalErrorHandler', 'showGlobalErrorDialog');

        this.zone.run(() => {
            const dialogRef: MatDialogRef<ErrorDialogComponent> = this.dialog.open(ErrorDialogComponent, {
                // TranslationService is not able to provide the translation of texts in this class.
                // So we use a workaround where the translation happens in the error dialog itself.
                width: '450px',
                data: { isGlobalError: true },
            });

            dialogRef.afterClosed().subscribe((result) => {
                // Quit the application
                this.logger.info('Closing application', 'GlobalErrorHandler', 'showGlobalErrorDialog');
                const win: BrowserWindow = this.application.getCurrentWindow();
                win.close();
            });
        });
    }
}
