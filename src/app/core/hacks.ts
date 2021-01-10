export class Hacks {
    /**
     * Removes all visible tooltips
     */
    public static removeTooltips(): void {
        while (document.getElementsByTagName('mat-tooltip-component').length > 0) {
            document.getElementsByTagName('mat-tooltip-component')[0].remove();
        }
    }
}
