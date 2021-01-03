import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/internal/operators';
import { BaseScheduler } from '../../core/scheduler/base-scheduler';

@Component({})
export abstract class CollectionListsComponent implements OnInit, OnDestroy {
    private readonly destroy$: Subject<void> = new Subject();

    constructor(public zone: NgZone, public scheduler: BaseScheduler) { }

    public canShowLists: boolean = true;

    public async ngOnInit(): Promise<void> {
        await this.fillListsAsync();

        fromEvent(window, 'resize')
            .pipe(
                debounceTime(10),
                takeUntil(this.destroy$),
            )
            .subscribe(() => this.zone.run(async () => {
                await this.refreshVirtualizedListsAsync();
            }));
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async refreshVirtualizedListsAsync(): Promise<void> {
        // cdk-virtual-scroll-viewport doesn't resize its viewport automatically,
        // so we need to use this retarded workaround.
        this.canShowLists = false;
        await this.scheduler.sleepAsync(50);
        this.canShowLists = true;
    }

    public abstract fillListsAsync(): Promise<void>;
}
