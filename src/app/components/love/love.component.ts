import { Component, Input, ViewEncapsulation } from '@angular/core';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseDialogService } from '../../services/dialog/base-dialog.service';
import { BaseMetadataService } from '../../services/metadata/base-metadata.service';
import { BaseScrobblingService } from '../../services/scrobbling/base-scrobbling.service';
import { TrackModel } from '../../services/track/track-model';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';

@Component({
    selector: 'app-love',
    host: { style: 'display: block' },
    templateUrl: './love.component.html',
    styleUrls: ['./love.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoveComponent {
    private _track: TrackModel;

    public constructor(
        private appearanceService: BaseAppearanceService,
        private scrobblingService: BaseScrobblingService,
        private metadataService: BaseMetadataService,
        private dialogService: BaseDialogService,
        private translatorService: BaseTranslatorService
    ) {}

    public get largerFontSize(): number {
        return this.fontSize + 4;
    }

    @Input()
    public fontSize: number = this.appearanceService.selectedFontSize.normalSize;

    @Input()
    public lineHeight: number = 1;

    @Input()
    public set track(v: TrackModel) {
        this._track = v;
    }

    public get track(): TrackModel {
        return this._track;
    }

    public async toggleLoveAsync(): Promise<void> {
        switch (this._track.love) {
            case 0:
                this._track.love = 1;
                break;
            case 1:
                this._track.love = -1;
                break;
            case -1:
                this._track.love = 0;
                break;
            default:
                this._track.love = 0;
                break;
        }

        await this.scrobblingService.sendTrackLoveAsync(this._track, this._track.love === 1);

        try {
            await this.metadataService.saveTrackLoveAsync(this._track);
        } catch (error) {
            this.dialogService.showErrorDialog(await this.translatorService.getAsync('save-love-error'));
        }
    }
}
