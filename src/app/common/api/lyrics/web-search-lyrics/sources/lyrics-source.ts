import { IWebSearchLyricsSource } from './i-web-search-lyrics-source';
import htmlParser, { HTMLElement } from 'node-html-parser';

export class LyricsSource implements IWebSearchLyricsSource {
    public get name(): string {
        return 'Lyrics';
    }

    public parse(htmlString: string): string {
        const htmlElement: HTMLElement = htmlParser(htmlString);

        return htmlElement.querySelector('pre#lyric-body-text')?.textContent.replace(/(<a.*">|<\/a>)/g, '') ?? '';
    }
}
