import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TrackModel } from '../../services/track/track-model';

@Component({
    selector: 'app-love',
    host: { style: 'display: block' },
    templateUrl: './love.component.html',
    styleUrls: ['./love.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoveComponent {
    private _track: TrackModel;

    @Input()
    public set track(v: TrackModel) {
        this._track = v;
    }

    public get track(): TrackModel {
        return this._track;
    }

    public toggleLove(): void {
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
    }
}
