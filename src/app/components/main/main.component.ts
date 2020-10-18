import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseScheduler } from '../../core/scheduler/base-scheduler';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseUpdateService } from '../../services/update/base-update.service';

@Component({
  selector: 'app-main',
  host: { 'style': 'display: block' },
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {

  constructor(
    public appearanceService: BaseAppearanceService,
    private updateService: BaseUpdateService,
    private indexingService: BaseIndexingService,
    private scheduler: BaseScheduler) { }

  public async ngOnInit(): Promise<void> {
    await this.updateService.checkForUpdatesAsync();
    this.indexCollectionInBackgroundAsync();
  }

  private async indexCollectionInBackgroundAsync(): Promise<void> {
    await this.scheduler.sleepAsync(2000);
    this.indexingService.indexCollectionIfNeededAsync();
  }
}
