import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseDialogService } from '../../services/dialog/base-dialog.service';
import { BaseMetadataService } from '../../services/metadata/base-metadata.service';
import { TrackModel } from '../../services/track/track-model';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';

@Component({
    selector: 'app-rating',
    host: { style: 'display: block' },
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RatingComponent implements OnInit {
    private _track: TrackModel;

    constructor(
        private metadataService: BaseMetadataService,
        private dialogService: BaseDialogService,
        private translatorService: BaseTranslatorService,
        private appearanceService: BaseAppearanceService
    ) {}

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

    public ngOnInit(): void {}

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
