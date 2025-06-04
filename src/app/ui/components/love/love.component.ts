import { Component, Input } from '@angular/core';
import { TrackModel } from '../../../services/track/track-model';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { ScrobblingService } from '../../../services/scrobbling/scrobbling.service';
import { MetadataService } from '../../../services/metadata/metadata.service';
import { DialogServiceBase } from '../../../services/dialog/dialog.service.base';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';

@Component({
    selector: 'app-love',
    host: { style: 'display: flex; align-items: center' },
    templateUrl: './love.component.html',
    styleUrls: ['./love.component.scss'],
})
export class LoveComponent {
    private _track: TrackModel;

    public constructor(
        private appearanceService: AppearanceServiceBase,
        private scrobblingService: ScrobblingService,
        private metadataService: MetadataService,
        private dialogService: DialogServiceBase,
        private translatorService: TranslatorServiceBase,
    ) {}

    @Input()
    public fontSize: number = this.appearanceService.selectedFontSize;

    @Input()
    public lineHeight: number = 1;

    @Input()
    public set track(v: TrackModel) {
        this._track = v;
    }

    public get track(): TrackModel {
        return this._track;
    }

    public get loveClasses(): string {
        switch (this._track.love) {
            case 1:
                return 'fas fa-heart accent-color-important';
            case -1:
                return 'fas fa-heart-crack accent-color-important';
            default:
                return 'far fa-heart secondary-text';
        }
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
