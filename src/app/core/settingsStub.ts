import { SettingsInterface } from './settingsInterface';

export class SettingsStub implements SettingsInterface {
  // Default language
  public get defaultLanguage(): string {
    return 'en';
  }

  // Language
  public get language(): string {
    return 'en';
  }

  public set language(v: string) {
  }

  // Theme
  public get colorTheme(): string {
    return 'default-blue-theme';
  }

  public set colorTheme(v: string) {
  }

  // Show welcome
  public get showWelcome(): boolean {
    return true;
  }

  public set showWelcome(v: boolean) {
  }

  // Use light theme
  public get useLightBackgroundTheme(): boolean {
    return false;
  }

  public set useLightBackgroundTheme(v: boolean) {
  }
}
