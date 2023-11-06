import { IWebSearchLyricsSource } from './i-web-search-lyrics-source';
import htmlParser from 'node-html-parser';
import { HTMLElement } from 'node-html-parser';
import { StringUtils } from '../../../../utils/string-utils';

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

        if (StringUtils.isNullOrWhiteSpace(content)) {
            return '';
        }

        return StringUtils.replaceAll(content!, '\n\n', '\n');
    }
}
