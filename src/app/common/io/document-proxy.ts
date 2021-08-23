import { Injectable } from '@angular/core';

@Injectable()
export class DocumentProxy {
    constructor() {}

    public getDocumentElement(): HTMLElement {
        return document.documentElement;
    }

    public getBody(): HTMLElement {
        return document.body;
    }
}
