import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';

@Component({
  selector: 'app-collection',
  host: { 'style': 'display: block' },
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionComponent implements OnInit {

  constructor(
    public appearanceService: BaseAppearanceService) { }

  public async ngOnInit(): Promise<void> {
  }

  public onSelectedTabChange(event: MatTabChangeEvent): void {
    // Manually trigger a window resize event. Together with CdkVirtualScrollViewportPatchDirective,
    // this will ensure that CdkVirtualScrollViewport triggers a viewport size check when the  
    // selected tab is changed.
    window.dispatchEvent(new Event('resize'));
  }
}
