import { BaseSettings } from '../../app/core/settings/base-settings';

export class SettingsMock implements BaseSettings {
    constructor(public showWelcome: boolean, public downloadMissingAlbumCovers: boolean) {
    }

    public get defaultLanguage(): string {
        return 'en';
    }

    public language: string = '';
    public checkForUpdates: boolean = false;
    public useSystemTitleBar: boolean = false;
    public fontSize: number = 0;
    public colorScheme: string = '';
    public followSystemTheme: boolean = false;
    public useLightBackgroundTheme: boolean = false;
    public followSystemColor: boolean = false;
    public ignoreRemovedFiles: boolean = false;
}
