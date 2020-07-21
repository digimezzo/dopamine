export abstract class BaseSettings {
    public abstract get defaultLanguage(): string;
    public abstract language: string;
    public abstract checkForUpdates: boolean;
    public abstract useCustomTitleBar: boolean;
    public abstract fontSize: number;
    public abstract colorScheme: string;
    public abstract showWelcome: boolean;
    public abstract useLightBackgroundTheme: boolean;
}
