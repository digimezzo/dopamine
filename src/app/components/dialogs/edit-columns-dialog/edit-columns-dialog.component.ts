import { Component, OnInit } from '@angular/core';
import { BaseTracksColumnsService } from '../../../services/track-columns/base-tracks-columns.service';
import { TracksColumnsVisibility } from '../../../services/track-columns/tracks-columns-visibility';

@Component({
    selector: 'app-edit-columns-dialog',
    templateUrl: './edit-columns-dialog.component.html',
    styleUrls: ['./edit-columns-dialog.component.scss'],
})
export class EditColumnsDialogComponent implements OnInit {
    constructor(private tracksColumnsService: BaseTracksColumnsService) {}

    public tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

    public ngOnInit(): void {
        this.tracksColumnsVisibility = this.tracksColumnsService.getTracksColumnsVisibility();
    }

    public setTracksColumnsVisibility(): void {
        this.tracksColumnsService.setTracksColumnsVisibility(this.tracksColumnsVisibility);
    }
}
