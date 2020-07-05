import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ErrorDialogComponent } from './components/dialogs/error-dialog/error-dialog.component';
import { remote, BrowserWindow } from 'electron';
import { Logger } from './core/logger';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private logger: Logger, private dialog: MatDialog, private zone: NgZone) { }

    public handleError(error: any): void {
        this.logger.error(`Handling global error. Cause: ${error}.`, 'GlobalErrorHandler', 'handleError');
        this.showGlobalErrorDialog();
    }

    public showGlobalErrorDialog(): void {
        this.logger.info('Showing global error dialog', 'GlobalErrorHandler', 'showGlobalErrorDialog');

        this.zone.run(() => {
            const dialogRef: MatDialogRef<ErrorDialogComponent> = this.dialog.open(ErrorDialogComponent, {
                // TranslationService is not able to provide the translation of texts in this class.
                // So we use a workaround where the translation happens in the error dialog itself.
                width: '450px', data: { isGlobalError: true }
            });

            dialogRef.afterClosed().subscribe(result => {
                // Quit the application
                this.logger.info('Closing application', 'GlobalErrorHandler', 'showGlobalErrorDialog');
                const win: BrowserWindow = remote.getCurrentWindow();
                win.close();
            });
        });
    }
}

