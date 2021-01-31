import { Pipe, PipeTransform } from '@angular/core';
import { TranslatorService } from '../services/translator/translator.service';

@Pipe({ name: 'formatTotalFileSize' })
export class FormatTotalFileSizePipe implements PipeTransform {
    constructor(private translatorService: TranslatorService) {}

    public transform(totalFileSizeInBytes: number): string {
        if (totalFileSizeInBytes == undefined || totalFileSizeInBytes <= 0) {
            return '';
        }

        const gigaBytesText: string = this.translatorService.get('FileSizes.GigaBytes');
        const megaBytesText: string = this.translatorService.get('FileSizes.MegaBytes');
        const kiloBytesText: string = this.translatorService.get('FileSizes.KiloBytes');

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
