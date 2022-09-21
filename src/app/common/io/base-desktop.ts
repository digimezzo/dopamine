import { Observable } from 'rxjs';

export abstract class BaseDesktop {
    public abstract accentColorChanged$: Observable<void>;
    public abstract nativeThemeUpdated$: Observable<void>;

    public abstract showSelectFolderDialogAsync(dialogTitle: string): Promise<string>;
    public abstract showSelectFileDialogAsync(dialogTitle: string): Promise<string>;

    public abstract openLink(url: string): void;
    public abstract openPath(path: string): void;
    public abstract showFileInDirectory(filePath: string): void;
    public abstract shouldUseDarkColors(): boolean;
    public abstract getAccentColor(): string;
    public abstract moveFileToTrashAsync(filePath: string): Promise<void>;
    public abstract getMusicDirectory(): string;
    public abstract getApplicationDataDirectory(): string;
}
