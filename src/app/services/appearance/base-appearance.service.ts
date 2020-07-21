import { ColorScheme } from './color-scheme';

export abstract class BaseAppearanceService {
    public abstract get windowHasNativeTitleBar(): boolean;
    public abstract colorSchemes: ColorScheme[];
    public abstract useLightBackgroundTheme: boolean;
    public abstract selectedColorScheme: ColorScheme;
    public abstract applyTheme(): void;
    public abstract applyFontSize(): void;
}
