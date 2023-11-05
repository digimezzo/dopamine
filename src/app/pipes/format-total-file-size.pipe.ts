import { Pipe, PipeTransform } from '@angular/core';
import { TranslatorServiceBase } from '../services/translator/translator.service.base';

@Pipe({ name: 'formatTotalFileSize' })
export class FormatTotalFileSizePipe implements PipeTransform {
    public constructor(private translatorService: TranslatorServiceBase) {}

    public transform(totalFileSizeInBytes: number | undefined): string {
        if (totalFileSizeInBytes == undefined || totalFileSizeInBytes <= 0) {
            return '';
        }

        const gigaBytesText: string = this.translatorService.get('giga-bytes');
        const megaBytesText: string = this.translatorService.get('mega-bytes');
        const kiloBytesText: string = this.translatorService.get('kilo-bytes');

        const gigaBytes: number = Math.floor(totalFileSizeInBytes / (1024 * 1024 * 1024));
        const megaBytes: number = Math.floor(totalFileSizeInBytes / (1024 * 1024));
        const kiloBytes: number = Math.floor(totalFileSizeInBytes / 1024);

        if (gigaBytes > 0) {
            return `${gigaBytes} ${gigaBytesText}`;
        }
        if (megaBytes > 0) {
            return `${megaBytes} ${megaBytesText}`;
        }

        return `${kiloBytes} ${kiloBytesText}`;
    }
}
