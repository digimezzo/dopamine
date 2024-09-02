import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-cover-player-playback-queue',
    host: { style: 'display: block' },
    templateUrl: './cover-player-playback-queue.component.html',
    styleUrls: ['./cover-player-playback-queue.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CoverPlayerPlaybackQueueComponent {}
