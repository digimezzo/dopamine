import { Directive, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ContextMenuOpener } from '../../../common/context-menu-opener';
import { BaseDesktop } from '../../../common/io/base-desktop';
import { Logger } from '../../../common/logger';
import { MouseSelectionWatcher } from '../../../common/mouse-selection-watcher';
import { BaseCollectionService } from '../../../services/collection/base-collection.service';
import { BaseDialogService } from '../../../services/dialog/base-dialog.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { TrackModel } from '../../../services/track/track-model';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';

@Directive()
export class TrackBrowserBase {
    public constructor(
        public playbackService: BasePlaybackService,
        public dialogService: BaseDialogService,
        public addToPlaylistMenu: AddToPlaylistMenu,
        public contextMenuOpener: ContextMenuOpener,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        public logger: Logger,
        private collectionService: BaseCollectionService,
        private translatorService: BaseTranslatorService,
        private desktop: BaseDesktop
    ) {}

    @ViewChild('trackContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public trackContextMenu: MatMenuTrigger;

    public onTrackContextMenu(event: MouseEvent, track: TrackModel): void {
        this.contextMenuOpener.open(this.trackContextMenu, event, track);
    }

    public async onAddToQueueAsync(): Promise<void> {
        await this.playbackService.addTracksToQueueAsync(this.mouseSelectionWatcher.selectedItems as TrackModel[]);
    }

    public onShowInFolder(): void {
        const tracks: TrackModel[] = this.mouseSelectionWatcher.selectedItems as TrackModel[];

        if (tracks.length > 0) {
            this.desktop.showFileInDirectory(tracks[0].path);
        }
    }

    public async onDeleteAsync(): Promise<void> {
        const tracks: TrackModel[] = this.mouseSelectionWatcher.selectedItems as TrackModel[];

        let dialogTitle: string = await this.translatorService.getAsync('delete-song');
        let dialogText: string = await this.translatorService.getAsync('confirm-delete-song');

        if (tracks.length > 1) {
            dialogTitle = await this.translatorService.getAsync('delete-songs');
            dialogText = await this.translatorService.getAsync('confirm-delete-songs');
        }

        const userHasConfirmed: boolean = await this.dialogService.showConfirmationDialogAsync(dialogTitle, dialogText);

        if (userHasConfirmed) {
            try {
                if (!(await this.collectionService.deleteTracksAsync(tracks))) {
                    throw new Error('deleteTracksAsync returned false');
                }
            } catch (e: unknown) {
                this.logger.error(e, 'Could not delete all files', 'TrackBrowserBase', 'onDelete');

                const errorText: string = await this.translatorService.getAsync('delete-songs-error');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }
}
