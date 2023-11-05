import { Component, OnInit } from '@angular/core';
import { TracksColumnsVisibility } from '../../../../services/track-columns/tracks-columns-visibility';
import { TracksColumnsServiceBase } from '../../../../services/track-columns/tracks-columns.service.base';

@Component({
    selector: 'app-edit-columns-dialog',
    templateUrl: './edit-columns-dialog.component.html',
    styleUrls: ['./edit-columns-dialog.component.scss'],
})
export class EditColumnsDialogComponent implements OnInit {
    public constructor(private tracksColumnsService: TracksColumnsServiceBase) {}

    public tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

    public ngOnInit(): void {
        this.tracksColumnsVisibility = this.tracksColumnsService.getTracksColumnsVisibility();
    }

    public setTracksColumnsVisibility(): void {
        this.tracksColumnsService.setTracksColumnsVisibility(this.tracksColumnsVisibility);
    }
}
