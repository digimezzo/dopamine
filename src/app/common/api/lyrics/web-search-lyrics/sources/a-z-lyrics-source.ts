import { IWebSearchLyricsSource } from './i-web-search-lyrics-source';
import htmlParser from 'node-html-parser';
import { HTMLElement } from 'node-html-parser';
import { Strings } from '../../../../strings';

export class AZLyricsSource implements IWebSearchLyricsSource {
    public get name(): string {
        return 'AZLyrics';
    }

    public parse(htmlString: string): string {
        const htmlElement: HTMLElement = htmlParser(htmlString);

        let possibleContent =
            htmlElement.querySelector('div.ringtone')?.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;

        if (htmlElement.querySelector('span.feat')) {
            possibleContent = possibleContent?.nextElementSibling.nextElementSibling;
        }

        const content: string | undefined = possibleContent?.textContent.trim();

        if (Strings.isNullOrWhiteSpace(content)) {
            return '';
        }

        return Strings.replaceAll(content!, '\n\n', '\n');
    }
}
