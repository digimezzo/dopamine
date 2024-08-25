import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TrayServiceBase } from '../../../../services/tray/tray.service.base';
import { MediaSessionServiceBase } from '../../../../services/media-session/media-session.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { CollectionUtils } from '../../../../common/utils/collections-utils';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { StringUtils } from '../../../../common/utils/string-utils';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { Logger } from '../../../../common/logger';

@Component({
    selector: 'app-behavior-settings',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './behavior-settings.component.html',
    styleUrls: ['./behavior-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BehaviorSettingsComponent implements OnInit {
    public constructor(
        public trayService: TrayServiceBase,
        public mediaSessionService: MediaSessionServiceBase,
        private dialogService: DialogServiceBase,
        private translatorService: TranslatorServiceBase,
        public settings: SettingsBase,
        private logger: Logger,
    ) {}

    public ngOnInit(): void {
        this.artistSplitSeparators = CollectionUtils.fromString(this.settings.artistSplitSeparators);
        this.artistSplitExceptions = CollectionUtils.fromString(this.settings.artistSplitExceptions);
    }

    public artistSplitSeparators: string[] = [];
    public artistSplitExceptions: string[] = [];

    public async addSplitSeparatorAsync(): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('add-symbol');
        const newSplitSeparator: string = await this.dialogService.showInputDialogAsync(dialogTitle, '', '', ['[', ']']);

        if (!StringUtils.isNullOrWhiteSpace(newSplitSeparator)) {
            try {
                this.artistSplitSeparators.push(newSplitSeparator.trim());
                this.settings.artistSplitSeparators = CollectionUtils.toString(this.artistSplitSeparators);
            } catch (e: unknown) {
                this.logger.error(
                    e,
                    `Could not add split separator "${newSplitSeparator}"`,
                    'BehaviorSettingsComponent',
                    'addSplitSeparatorAsync',
                );

                const errorText: string = await this.translatorService.getAsync('add-symbol-error');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }

    public async removeSplitSeparatorAsync(separator: string): Promise<void> {
        let dialogTitle: string = await this.translatorService.getAsync('remove-symbol');
        let dialogText: string = await this.translatorService.getAsync('confirm-remove-symbol', { symbol: separator });
        const userHasConfirmed: boolean = await this.dialogService.showConfirmationDialogAsync(dialogTitle, dialogText);

        if (userHasConfirmed) {
            try {
                const index = this.artistSplitSeparators.indexOf(separator);
                if (index !== -1) {
                    this.artistSplitSeparators.splice(index, 1);
                    this.settings.artistSplitSeparators = CollectionUtils.toString(this.artistSplitSeparators);
                }
            } catch (e: unknown) {
                this.logger.error(e, 'Could not remove split separator', 'BehaviorSettingsComponent', 'removeSplitSeparatorAsync');

                const errorText: string = await this.translatorService.getAsync('remove-symbol-error');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }

    public async addSplitExceptionAsync(): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('add-artist');
        const newSplitException: string = await this.dialogService.showInputDialogAsync(dialogTitle, '', '', []);

        if (!StringUtils.isNullOrWhiteSpace(newSplitException)) {
            try {
                this.artistSplitExceptions.push(newSplitException.trim());
                this.settings.artistSplitExceptions = CollectionUtils.toString(this.artistSplitExceptions);
            } catch (e: unknown) {
                this.logger.error(
                    e,
                    `Could not add split exception "${newSplitException}"`,
                    'BehaviorSettingsComponent',
                    'addSplitExceptionAsync',
                );

                const errorText: string = await this.translatorService.getAsync('add-artist-error');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }

    public async removeSplitExceptionAsync(exception: string): Promise<void> {
        let dialogTitle: string = await this.translatorService.getAsync('remove-artist');
        let dialogText: string = await this.translatorService.getAsync('confirm-remove-artist', { artist: exception });
        const userHasConfirmed: boolean = await this.dialogService.showConfirmationDialogAsync(dialogTitle, dialogText);

        if (userHasConfirmed) {
            try {
                const index = this.artistSplitExceptions.indexOf(exception);
                if (index !== -1) {
                    this.artistSplitExceptions.splice(index, 1);
                    this.settings.artistSplitExceptions = CollectionUtils.toString(this.artistSplitExceptions);
                }
            } catch (e: unknown) {
                this.logger.error(e, 'Could not remove split exception', 'BehaviorSettingsComponent', 'removeSplitExceptionAsync');

                const errorText: string = await this.translatorService.getAsync('remove-artist-error');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }
}
