import { Observable } from 'rxjs';

export abstract class DesktopBase {
    public abstract accentColorChanged$: Observable<void>;
    public abstract nativeThemeUpdated$: Observable<void>;

    public abstract showSelectFolderDialogAsync(dialogTitle: string): Promise<string>;
    public abstract showSelectFileDialogAsync(dialogTitle: string): Promise<string>;
    public abstract showSaveFileDialogAsync(dialogTitle: string, defaultPath: string): Promise<string>;

    public abstract openLinkAsync(url: string): Promise<void>;
    public abstract openPathAsync(path: string): Promise<void>;
    public abstract showFileInDirectory(filePath: string): void;
    public abstract shouldUseDarkColors(): boolean;
    public abstract getAccentColor(): string;
    public abstract moveFileToTrashAsync(filePath: string): Promise<void>;
    public abstract getMusicDirectory(): string;
    public abstract getApplicationDataDirectory(): string;
}
