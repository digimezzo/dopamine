import { FontSize } from '../../common/application/font-size';
import { Theme } from './theme/theme';

export abstract class BaseAppearanceService {
    public abstract themesDirectoryPath: string;
    public abstract get windowHasNativeTitleBar(): boolean;
    public abstract get isUsingLightTheme(): boolean;
    public abstract fontSizes: FontSize[];
    public abstract themes: Theme[];
    public abstract followSystemTheme: boolean;
    public abstract useLightBackgroundTheme: boolean;
    public abstract followSystemColor: boolean;
    public abstract selectedTheme: Theme;
    public abstract selectedFontSize: FontSize;
    public abstract startWatchingThemesDirectory(): void;
    public abstract stopWatchingThemesDirectory(): void;
    public abstract refreshThemes(): void;
    public abstract applyAppearance(): void;
    public abstract applyMargins(isSearchVisible: boolean): void;
}
