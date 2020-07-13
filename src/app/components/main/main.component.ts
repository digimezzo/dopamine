import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../services/appearance/appearance-service-base';
import { UpdateServiceBase } from '../../services/update/update-service-base';
import { IndexingServiceBase } from '../../services/indexing/indexing-service-base';

@Component({
  selector: 'app-main',
  host: { 'style': 'display: block' },
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {

  constructor(
    public appearanceService: AppearanceServiceBase,
    private updateService: UpdateServiceBase,
    private indexingService: IndexingServiceBase) { }

  public ngOnInit(): void {
    // Check for updates (don't await)
    this.updateService.checkForUpdatesAsync();

    // Start indexing
    this.indexingService.startIndexing();
  }
}
