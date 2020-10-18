import { BaseSettings } from '../../app/core/settings/base-settings';

export class SettingsMock implements BaseSettings {
    constructor(public showWelcome: boolean) {
    }

    public get defaultLanguage(): string {
        return 'en';
    }

    public language: string = '';
    public checkForUpdates: boolean = false;
    public useCustomTitleBar: boolean = false;
    public fontSize: number = 0;
    public colorScheme: string = '';
    public useLightBackgroundTheme: boolean = false;
    public ignoreRemovedFiles: boolean = false;
    public downloadMissingAlbumCovers: boolean = false;
}
