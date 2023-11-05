import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TrackModel } from '../../services/track/track-model';
import { AppearanceServiceBase } from '../../services/appearance/appearance.service.base';
import { ScrobblingServiceBase } from '../../services/scrobbling/scrobbling.service.base';
import { MetadataServiceBase } from '../../services/metadata/metadata.service.base';
import { DialogServiceBase } from '../../services/dialog/dialog.service.base';
import { TranslatorServiceBase } from '../../services/translator/translator.service.base';

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
        private appearanceService: AppearanceServiceBase,
        private scrobblingService: ScrobblingServiceBase,
        private metadataService: MetadataServiceBase,
        private dialogService: DialogServiceBase,
        private translatorService: TranslatorServiceBase,
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
            this.metadataService.saveTrackLove(this._track);
        } catch (error) {
            this.dialogService.showErrorDialog(await this.translatorService.getAsync('save-love-error'));
        }
    }
}
