import { Observable } from 'rxjs';

export abstract class BaseElectronProxy {
    public abstract accentColorChanged$: Observable<void>;
    public abstract nativeThemeUpdated$: Observable<void>;
    public abstract onAccentColorChanged(): void;
    public abstract onNativeThemeUpdated(): void;
    public abstract getGlobal(name: string): any;
    public abstract shouldUseDarkColors(): boolean;
    public abstract getAccentColor(): string;
}
