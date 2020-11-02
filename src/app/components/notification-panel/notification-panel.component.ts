import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseUpdateService } from '../../services/update/base-update.service';

@Component({
  selector: 'app-notification-panel',
  host: { 'style': 'display: block' },
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('visibility', [
      state('visible', style({
        height: 30
      })),
      state('hidden', style({
        height: 0
      })),
      transition('hidden => visible', animate('.25s')),
      transition('visible => hidden', animate('.25s'))
    ])
  ]
})
export class NotificationPanelComponent implements OnInit {

  constructor(public indexingService: BaseIndexingService, private updateService: BaseUpdateService) { }

  public visibility: string = 'hidden';

  public async ngOnInit(): Promise<void> {
    // await this.scheduler.sleepAsync(5000);
    // this.notificationService.isNotifying = true;
    // this.visibility = 'visible';
    // await this.scheduler.sleepAsync(5000);
    // this.notificationService.isNotifying = false;
    // this.visibility = 'hidden';
  }
}
