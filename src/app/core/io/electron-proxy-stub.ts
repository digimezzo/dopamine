import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseElectronProxy } from './base-electron-proxy';

@Injectable()
export class ElectronProxyStub implements BaseElectronProxy {
    private accentColorChanged: Subject<void> = new Subject();
    private nativeThemeUpdated: Subject<void> = new Subject();

    constructor() {}

    public accentColorChanged$: Observable<void> = this.accentColorChanged.asObservable();
    public nativeThemeUpdated$: Observable<void> = this.nativeThemeUpdated.asObservable();

    public onAccentColorChanged(): void {
        this.accentColorChanged.next();
    }

    public onNativeThemeUpdated(): void {
        this.nativeThemeUpdated.next();
    }

    public getGlobal(name: string): any {
        return false;
    }

    public shouldUseDarkColors(): boolean {
        return false;
    }

    public getAccentColor(): string {
        return '#00FF00';
    }
}
