import { IWebSearchLyricsSource } from './i-web-search-lyrics-source';
import htmlParser, { HTMLElement } from 'node-html-parser';

export class MusixmatchSource implements IWebSearchLyricsSource {
    public get name(): string {
        return 'Musixmatch';
    }

    public parse(htmlString: string): string {
        const htmlElement: HTMLElement = htmlParser(htmlString);

        return htmlElement
            .querySelectorAll('p.mxm-lyrics__content')
            .map((x) => x.textContent)
            .join('');
    }
}
