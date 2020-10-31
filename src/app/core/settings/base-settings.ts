export abstract class BaseSettings {
    public abstract get defaultLanguage(): string;
    public abstract language: string;
    public abstract checkForUpdates: boolean;
    public abstract useSystemTitleBar: boolean;
    public abstract fontSize: number;
    public abstract colorScheme: string;
    public abstract showWelcome: boolean;
    public abstract followSystemTheme: boolean;
    public abstract useLightBackgroundTheme: boolean;
    public abstract followSystemColor: boolean;
    public abstract ignoreRemovedFiles: boolean;
    public abstract downloadMissingAlbumCovers: boolean;
}
