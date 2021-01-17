import { BaseSettings } from './base-settings';

export class SettingsMock implements BaseSettings {
    constructor() {}

    public get defaultLanguage(): string {
        return 'en';
    }

    public showWelcome: boolean;
    public downloadMissingAlbumCovers: boolean;
    public refreshCollectionAutomatically: boolean;
    public language: string = '';
    public checkForUpdates: boolean = false;
    public useSystemTitleBar: boolean = false;
    public fontSize: number = 14;
    public colorScheme: string = '';
    public followSystemTheme: boolean = false;
    public useLightBackgroundTheme: boolean = false;
    public followSystemColor: boolean = false;
    public skipRemovedFilesDuringRefresh: boolean = false;
    public showAllFoldersInCollection: boolean = false;
    public foldersLeftPaneWithPercent: number = 30;
}
