import { Pipe, PipeTransform } from '@angular/core';
import { StringCompare } from '../core/string-compare';
import { BaseTranslatorService } from '../services/translator/base-translator.service';

@Pipe({ name: 'formatAlbumTitle' })
export class FormatAlbumTitlePipe implements PipeTransform {
    constructor(private translatorService: BaseTranslatorService) {}

    public transform(albumTitle: string): string {
        if (StringCompare.isNullOrWhiteSpace(albumTitle)) {
            return this.translatorService.get('Album.UnknownTitle');
        }

        return albumTitle;
    }
}
