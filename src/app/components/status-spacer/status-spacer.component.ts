import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseStatusService } from '../../services/status/base-status.service';
import { StatusMessage } from '../../services/status/status-message';

@Component({
  selector: 'app-status-spacer',
  host: { 'style': 'display: block' },
  templateUrl: './status-spacer.component.html',
  styleUrls: ['./status-spacer.component.scss'],
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
export class StatusSpacerComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  constructor(public statusService: BaseStatusService) { }

  public visibility: string = 'hidden';

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public async ngOnInit(): Promise<void> {
    this.subscription.add(this.statusService.statusMessage$.subscribe((statusMessage) => this.processStatusMessage(statusMessage)));
    this.processStatusMessage(this.statusService.getCurrentStatusMessage());
  }

  private processStatusMessage(statusMessage: StatusMessage): void {
    if (statusMessage != undefined) {
      this.visibility = 'visible';
    } else {
      this.visibility = 'hidden';
    }
  }
}
