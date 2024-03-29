import { Injectable } from '@angular/core';
import sanitize from 'sanitize-filename';

@Injectable()
export class TextSanitizer {
    public sanitize(textToSanitize: string): string {
        return sanitize(textToSanitize);
    }
}
