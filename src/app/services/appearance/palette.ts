import tinycolor from 'tinycolor2';

/**
 * Palette generation based on: https://github.com/mbitson/mcg
 */
export class Palette {
    constructor(private baseHexColor: string) {}

    public get color50(): string {
        return tinycolor(this.baseHexColor).lighten(52).toHexString().toLowerCase();
    }

    public get color100(): string {
        return tinycolor(this.baseHexColor).lighten(37).toHexString().toLowerCase();
    }

    public get color200(): string {
        return tinycolor(this.baseHexColor).lighten(26).toHexString().toLowerCase();
    }

    public get color300(): string {
        return tinycolor(this.baseHexColor).lighten(12).toHexString().toLowerCase();
    }

    public get color400(): string {
        return tinycolor(this.baseHexColor).lighten(6).toHexString().toLowerCase();
    }

    public get color500(): string {
        return tinycolor(this.baseHexColor).toHexString().toLowerCase();
    }

    public get color600(): string {
        return tinycolor(this.baseHexColor).darken(6).toHexString().toLowerCase();
    }

    public get color700(): string {
        return tinycolor(this.baseHexColor).darken(12).toHexString().toLowerCase();
    }

    public get color800(): string {
        return tinycolor(this.baseHexColor).darken(18).toHexString().toLowerCase();
    }

    public get color900(): string {
        return tinycolor(this.baseHexColor).darken(24).toHexString().toLowerCase();
    }

    public get colorA100(): string {
        return tinycolor(this.baseHexColor).lighten(50).saturate(30).toHexString().toLowerCase();
    }

    public get colorA200(): string {
        return tinycolor(this.baseHexColor).lighten(30).saturate(30).toHexString().toLowerCase();
    }

    public get colorA400(): string {
        return tinycolor(this.baseHexColor).lighten(10).saturate(15).toHexString().toLowerCase();
    }

    public get colorA700(): string {
        return tinycolor(this.baseHexColor).lighten(5).saturate(5).toHexString().toLowerCase();
    }
}
