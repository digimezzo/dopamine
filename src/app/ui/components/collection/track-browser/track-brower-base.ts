import { Directive, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Logger } from '../../../../common/logger';
import { TrackModel } from '../../../../services/track/track-model';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { CollectionServiceBase } from '../../../../services/collection/collection.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { DesktopBase } from '../../../../common/io/desktop.base';
import { MouseSelectionWatcher } from '../../mouse-selection-watcher';
import { ContextMenuOpener } from '../../context-menu-opener';
import { PlaybackService } from '../../../../services/playback/playback.service';

@Directive()
export class TrackBrowserBase {
    public constructor(
        public playbackService: PlaybackService,
        public dialogService: DialogServiceBase,
        public addToPlaylistMenu: AddToPlaylistMenu,
        public contextMenuOpener: ContextMenuOpener,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        public logger: Logger,
        private collectionService: CollectionServiceBase,
        private translatorService: TranslatorServiceBase,
        private desktop: DesktopBase,
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

    public async onEdit(): Promise<void> {
        const tracks: TrackModel[] = this.mouseSelectionWatcher.selectedItems as TrackModel[];
        const userHasConfirmed: boolean = await this.dialogService.showEditTracksAsync(tracks);

        if (userHasConfirmed) {
            // try {
            //     if (!(await this.collectionService.deleteTracksAsync(tracks))) {
            //         throw new Error('deleteTracksAsync returned false');
            //     }
            // } catch (e: unknown) {
            //     this.logger.error(e, 'Could not delete all files', 'TrackBrowserBase', 'onDelete');
            //
            //     const errorText: string = await this.translatorService.getAsync('delete-songs-error');
            //     this.dialogService.showErrorDialog(errorText);
            // }
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
