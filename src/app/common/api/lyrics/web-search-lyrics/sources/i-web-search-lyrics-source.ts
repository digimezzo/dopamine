export interface IWebSearchLyricsSource {
    readonly name: string;
    parse(htmlString: string): string;
}
