import { Injectable } from '@angular/core';
import { remote } from 'electron';
import { Observable, Subject } from 'rxjs';
import { BaseElectronProxy } from './base-electron-proxy';

@Injectable()
export class ElectronProxy implements BaseElectronProxy {
    private accentColorChanged: Subject<void> = new Subject();
    private nativeThemeUpdated: Subject<void> = new Subject();

    constructor() {
        if (remote.systemPreferences != undefined) {
            remote.systemPreferences.on('accent-color-changed', () => this.onAccentColorChanged());
        }

        if (remote.nativeTheme != undefined) {
            remote.nativeTheme.on('updated', () => this.onNativeThemeUpdated());
        }
    }

    public accentColorChanged$: Observable<void> = this.accentColorChanged.asObservable();
    public nativeThemeUpdated$: Observable<void> = this.nativeThemeUpdated.asObservable();

    public onAccentColorChanged(): void {
        this.accentColorChanged.next();
    }

    public onNativeThemeUpdated(): void {
        this.nativeThemeUpdated.next();
    }

    public getGlobal(name: string): any {
        return remote.getGlobal(name);
    }

    public shouldUseDarkColors(): boolean {
        return remote.nativeTheme.shouldUseDarkColors;
    }

    public getAccentColor(): string {
        return remote.systemPreferences.getAccentColor();
    }
}
