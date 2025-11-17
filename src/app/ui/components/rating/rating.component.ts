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

    public stars = [1, 2, 3, 4, 5];

    public async onStarClickAsync(event: MouseEvent, starIndex: number): Promise<void> {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const half = clickX < rect.width / 2; // left = half star

        // Each star = 2 points
        // star 1 → 0–2
        // star 2 → 2–4 ...
        let newRating = (starIndex - 1) * 2 + (half ? 1 : 2);

        // Clicking same rating again resets to 0
        if (this._track.rating === newRating) {
            newRating = 0;
        }

        await this.setRatingAsync(newRating);
    }

    public getStarClass(starIndex: number): string {
        if (this._track == undefined) {
            return 'far fa-star secondary-text';
        }

        const rating = this._track.rating;

        const fullValue = starIndex * 2; // 2,4,6,8,10
        const halfValue = fullValue - 1; // 1,3,5,7,9

        if (rating >= fullValue) {
            return 'fas fa-star accent-color-important'; // full
        }

        if (rating === halfValue) {
            return 'fas fa-star-half-alt accent-color-important'; // half
        }

        return 'far fa-star secondary-text'; // empty
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
