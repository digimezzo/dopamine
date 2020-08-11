import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
    private indexingService: BaseIndexingService) { }

  public async ngOnInit(): Promise<void> {
    await this.updateService.checkForUpdatesAsync();
    await this.indexingService.indexCollectionIfNeededAsync();
  }
}
