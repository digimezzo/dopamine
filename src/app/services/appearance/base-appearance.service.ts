import { FontSize } from '../../common/application/font-size';
import { ColorScheme } from './color-scheme';

export abstract class BaseAppearanceService {
    public abstract get windowHasNativeTitleBar(): boolean;
    public abstract fontSizes: FontSize[];
    public abstract colorSchemes: ColorScheme[];
    public abstract followSystemTheme: boolean;
    public abstract useLightBackgroundTheme: boolean;
    public abstract followSystemColor: boolean;
    public abstract selectedColorScheme: ColorScheme;
    public abstract selectedFontSize: FontSize;
    public abstract applyTheme(): void;
    public abstract applyFontSize(): void;
}
