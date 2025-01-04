import { Component, Input } from '@angular/core';
import { TrackModel } from '../../../services/track/track-model';
import { MetadataService } from '../../../services/metadata/metadata.service';
import { DialogServiceBase } from '../../../services/dialog/dialog.service.base';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';

@Component({
    selector: 'app-rating',
    host: { style: 'display: flex; align-items: center' },
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss'],
})
export class RatingComponent {
    private _track: TrackModel;

    public constructor(
        private metadataService: MetadataService,
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

    public get star1Classes(): string {
        return this._track.rating >= 1 ? 'fas fa-star accent-color-important' : 'far fa-star secondary-text';
    }

    public get star2Classes(): string {
        return this._track.rating >= 2 ? 'fas fa-star accent-color-important' : 'far fa-star secondary-text';
    }

    public get star3Classes(): string {
        return this._track.rating >= 3 ? 'fas fa-star accent-color-important' : 'far fa-star secondary-text';
    }

    public get star4Classes(): string {
        return this._track.rating >= 4 ? 'fas fa-star accent-color-important' : 'far fa-star secondary-text';
    }

    public get star5Classes(): string {
        return this._track.rating >= 5 ? 'fas fa-star accent-color-important' : 'far fa-star secondary-text';
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
