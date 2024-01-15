import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { SnackBarServiceBase } from '../../../services/snack-bar/snack-bar.service.base';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-notification-bar',
    templateUrl: './notification-bar.component.html',
    styleUrls: ['./notification-bar.component.scss'],
    animations: [
        trigger('expandCollapse', [
            state('collapsed', style({ height: '0', overflow: 'hidden' })),
            state('expanded', style({ height: '30px' })),
            transition('collapsed => expanded', animate('150ms ease-in')),
            transition('expanded => collapsed', animate('150ms ease-out')),
        ]),
    ],
})
export class NotificationBarComponent implements OnInit {
    private subscription: Subscription = new Subscription();

    public constructor(private snackbarService: SnackBarServiceBase) {}

    public ngOnInit(): void {
        this.subscription.add(
            this.snackbarService.showNotification$.subscribe(() => {
                this.isExpanded = true;
            }),
        );

        this.subscription.add(
            this.snackbarService.dismissNotification$.subscribe(() => {
                this.isExpanded = false;
            }),
        );

        this.isExpanded = this.snackbarService.mustShowNotification;
    }

    public isExpanded = false;
}
