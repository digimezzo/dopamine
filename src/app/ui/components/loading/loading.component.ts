import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { UpdateServiceBase } from '../../../services/update/update.service.base';
import { FileServiceBase } from '../../../services/file/file.service.base';
import { SchedulerBase } from '../../../common/scheduling/scheduler.base';
import { SettingsBase } from '../../../common/settings/settings.base';
import { IndexingService } from '../../../services/indexing/indexing.service';
import { PlaybackService } from '../../../services/playback/playback.service';

@Component({
    selector: 'app-loading',
    host: { style: 'display: block' },
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoadingComponent implements OnInit {
    public constructor(
        public navigationService: NavigationServiceBase,
        public appearanceService: AppearanceServiceBase,
        private playbackService: PlaybackService,
        private settings: SettingsBase,
        private updateService: UpdateServiceBase,
        private indexingService: IndexingService,
        private fileService: FileServiceBase,
        private scheduler: SchedulerBase,
    ) {}

    public async ngOnInit(): Promise<void> {
        if (this.settings.showWelcome) {
            this.settings.showWelcome = false;
            await this.navigationService.navigateToWelcomeAsync();
        } else {
            if (this.fileService.hasPlayableFilesAsParameters()) {
                await this.fileService.enqueueParameterFilesAsync();

                if (this.settings.playerType === 'cover') {
                    await this.navigationService.navigateToCoverPlayerAsync();
                } else {
                    await this.navigationService.navigateToNowPlayingAsync();
                }
            } else {
                await this.playbackService.RestoreQueueIfNeededAsync();

                if (this.settings.playerType === 'cover') {
                    await this.navigationService.navigateToCoverPlayerAsync();
                } else {
                    await this.navigationService.navigateToCollectionAsync();
                }
                await this.initializeAsync();
            }
        }
    }

    private async initializeAsync(): Promise<void> {
        await this.scheduler.sleepAsync(2000);

        if (this.settings.refreshCollectionAutomatically) {
            this.indexingService.indexCollectionIfOutdated();
        }

        await this.updateService.checkForUpdatesAsync();
    }
}
