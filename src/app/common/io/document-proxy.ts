import { Injectable } from '@angular/core';

@Injectable()
export class DocumentProxy {
    public getDocumentElement(): HTMLElement {
        return document.documentElement;
    }

    public getBody(): HTMLElement {
        return document.body;
    }

    public getCanvasById(canvasId: string): HTMLCanvasElement {
        return document.getElementById(canvasId) as HTMLCanvasElement;
    }

    public getActiveElement(): Element | null {
        return document.activeElement;
    }
}
