import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TrackModel } from '../../../services/track/track-model';
import { MetadataServiceBase } from '../../../services/metadata/metadata.service.base';
import { DialogServiceBase } from '../../../services/dialog/dialog.service.base';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';

@Component({
    selector: 'app-rating',
    host: { style: 'display: block' },
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RatingComponent {
    private _track: TrackModel;

    public constructor(
        private metadataService: MetadataServiceBase,
        private dialogService: DialogServiceBase,
        private translatorService: TranslatorServiceBase,
        private appearanceService: AppearanceServiceBase,
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

    public async setRatingAsync(rating: number): Promise<void> {
        if (this._track == undefined) {
            return;
        }

        let ratingToSet: number = rating;

        if (this._track.rating === rating) {
            ratingToSet = 0;
        }

        this._track.rating = ratingToSet;

        try {
            await this.metadataService.saveTrackRatingAsync(this._track);
        } catch (error) {
            this.dialogService.showErrorDialog(await this.translatorService.getAsync('save-rating-error'));
        }
    }
}
