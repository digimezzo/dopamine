export class AnimatedPage {
    public page: number = 0;
    public previousPage: number = -1;

    public rightToLeft(page: number): boolean {
        return this.page === page && this.previousPage > this.page;
    }

    public leftToRight(page: number): boolean {
        return this.page === page && this.previousPage <= this.page;
    }

    public setPage(page: number): void {
        this.previousPage = this.page;
        this.page = page;
    }
}
