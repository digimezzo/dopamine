import { IWebSearchLyricsSource } from './i-web-search-lyrics-source';
import htmlParser, { HTMLElement } from 'node-html-parser';

export class GeniusSource implements IWebSearchLyricsSource {
    public get name(): string {
        return 'Genius';
    }

    public parse(htmlString: string): string {
        const htmlElement: HTMLElement = htmlParser(htmlString);

        return htmlElement
            .querySelectorAll('div[data-lyrics-container=true]')
            .map((x: HTMLElement) => x.structuredText)
            .join('')
            .replace(/\[.+\]/g, '')
            .trim();
    }
}
