import { AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { EqualizerServiceBase } from '../../../../services/equalizer/equalizer.service.base';
import { EqualizerService } from '../../../../services/equalizer/equalizer.service';

@Component({
    selector: 'app-equalizer-dialog',
    templateUrl: './equalizer-dialog.component.html',
    styleUrls: ['./equalizer-dialog.component.scss'],
})
export class EqualizerDialogComponent implements AfterViewInit {
    public readonly minimumGain: number = EqualizerService.minimumGain;
    public readonly maximumGain: number = EqualizerService.maximumGain;

    // Inset (px) that keeps the dot fully inside the track at the extremes.
    private readonly dotRadius: number = 7;

    public viewBox: string = '0 0 100 100';
    public chartHeight: number = 100;
    public linePath: string = '';
    public areaPath: string = '';
    public dots: { x: number; y: number }[] = [];

    private activeBandIndex: number = -1;

    @ViewChild('bandsContainer') private bandsContainer!: ElementRef<HTMLElement>;
    @ViewChildren('track') private tracks!: QueryList<ElementRef<HTMLElement>>;

    public constructor(public equalizerService: EqualizerServiceBase) {}

    public ngAfterViewInit(): void {
        setTimeout(() => this.updateCurve());
    }

    @HostListener('window:resize')
    public onWindowResize(): void {
        this.updateCurve();
    }

    public get isEnabled(): boolean {
        return this.equalizerService.isEnabled;
    }

    public set isEnabled(value: boolean) {
        this.equalizerService.isEnabled = value;
    }

    public get bands(): readonly number[] {
        return this.equalizerService.bands;
    }

    public get gains(): number[] {
        return this.equalizerService.gains;
    }

    public get presetNames(): readonly string[] {
        return this.equalizerService.presetNames;
    }

    public get selectedPreset(): string {
        return this.equalizerService.selectedPreset;
    }

    public set selectedPreset(value: string) {
        this.equalizerService.selectedPreset = value;
        this.updateCurve();
    }

    public onTrackPointerDown(index: number, event: PointerEvent): void {
        if (!this.isEnabled) {
            return;
        }

        this.activeBandIndex = index;
        this.setGainFromPointer(index, event.clientY);
        event.preventDefault();
    }

    @HostListener('document:pointermove', ['$event'])
    public onDocumentPointerMove(event: PointerEvent): void {
        if (this.activeBandIndex < 0) {
            return;
        }

        this.setGainFromPointer(this.activeBandIndex, event.clientY);
    }

    @HostListener('document:pointerup')
    public onDocumentPointerUp(): void {
        this.activeBandIndex = -1;
    }

    public onTrackKeyDown(index: number, event: KeyboardEvent): void {
        if (!this.isEnabled) {
            return;
        }

        let delta: number = 0;
        if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
            delta = 1;
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
            delta = -1;
        } else {
            return;
        }

        this.equalizerService.setGain(index, (this.gains[index] ?? 0) + delta);
        this.updateCurve();
        event.preventDefault();
    }

    private setGainFromPointer(index: number, clientY: number): void {
        const track: HTMLElement | undefined = this.tracks?.toArray()[index]?.nativeElement;

        if (track === undefined) {
            return;
        }

        const rect: DOMRect = track.getBoundingClientRect();
        const usableHeight: number = rect.height - 2 * this.dotRadius;

        if (usableHeight <= 0) {
            return;
        }

        const fraction: number = Math.min(1, Math.max(0, (clientY - rect.top - this.dotRadius) / usableHeight));
        const gain: number = Math.round(this.maximumGain - fraction * (this.maximumGain - this.minimumGain));

        this.equalizerService.setGain(index, gain);
        this.updateCurve();
    }

    public reset(): void {
        this.equalizerService.reset();
        this.updateCurve();
    }

    // Measures the real slider tracks so the curve always passes through the actual thumb positions.
    private updateCurve(): void {
        const container: HTMLElement | undefined = this.bandsContainer?.nativeElement;
        const trackElements: ElementRef<HTMLElement>[] = this.tracks?.toArray() ?? [];

        if (container === undefined || trackElements.length === 0) {
            return;
        }

        const containerRect: DOMRect = container.getBoundingClientRect();
        const width: number = containerRect.width;
        const height: number = containerRect.height;

        if (width === 0 || height === 0) {
            return;
        }

        this.viewBox = `0 0 ${this.round(width)} ${this.round(height)}`;
        this.chartHeight = this.round(height);

        const range: number = this.maximumGain - this.minimumGain;
        const gains: number[] = this.gains;

        const points: { x: number; y: number }[] = [];
        for (let i = 0; i < trackElements.length; i++) {
            const rect: DOMRect = trackElements[i].nativeElement.getBoundingClientRect();
            const x: number = rect.left - containerRect.left + rect.width / 2;
            const top: number = rect.top - containerRect.top + this.dotRadius;
            const usableHeight: number = rect.height - 2 * this.dotRadius;
            const fraction: number = (this.maximumGain - (gains[i] ?? 0)) / range;
            points.push({ x: this.round(x), y: this.round(top + fraction * usableHeight) });
        }

        this.dots = points;

        // Extend to the container edges so the fill spans the full width.
        const curvePoints: { x: number; y: number }[] = [
            { x: 0, y: points[0].y },
            ...points,
            { x: width, y: points[points.length - 1].y },
        ];

        const line: string = this.buildSmoothLine(curvePoints);
        this.linePath = line;
        this.areaPath = `${line} L ${this.round(width)} ${this.round(height)} L 0 ${this.round(height)} Z`;
    }

    // Monotone cubic (Fritsch–Carlson) interpolation: passes through every point without overshoot.
    private buildSmoothLine(points: { x: number; y: number }[]): string {
        const count: number = points.length;

        if (count === 0) {
            return '';
        }

        if (count === 1) {
            return `M ${this.round(points[0].x)} ${this.round(points[0].y)}`;
        }

        const segmentWidths: number[] = [];
        const slopes: number[] = [];
        for (let i = 0; i < count - 1; i++) {
            const dx: number = points[i + 1].x - points[i].x;
            const dy: number = points[i + 1].y - points[i].y;
            segmentWidths.push(dx);
            slopes.push(dx === 0 ? 0 : dy / dx);
        }

        const tangents: number[] = new Array<number>(count).fill(0);
        tangents[0] = slopes[0];
        tangents[count - 1] = slopes[count - 2];
        for (let i = 1; i < count - 1; i++) {
            tangents[i] = slopes[i - 1] * slopes[i] <= 0 ? 0 : (slopes[i - 1] + slopes[i]) / 2;
        }

        for (let i = 0; i < count - 1; i++) {
            if (slopes[i] === 0) {
                tangents[i] = 0;
                tangents[i + 1] = 0;
                continue;
            }

            const a: number = tangents[i] / slopes[i];
            const b: number = tangents[i + 1] / slopes[i];
            const magnitude: number = a * a + b * b;

            if (magnitude > 9) {
                const scale: number = 3 / Math.sqrt(magnitude);
                tangents[i] = scale * a * slopes[i];
                tangents[i + 1] = scale * b * slopes[i];
            }
        }

        let path: string = `M ${this.round(points[0].x)} ${this.round(points[0].y)}`;
        for (let i = 0; i < count - 1; i++) {
            const dx: number = segmentWidths[i];
            const c1x: number = points[i].x + dx / 3;
            const c1y: number = points[i].y + (tangents[i] * dx) / 3;
            const c2x: number = points[i + 1].x - dx / 3;
            const c2y: number = points[i + 1].y - (tangents[i + 1] * dx) / 3;

            path += ` C ${this.round(c1x)} ${this.round(c1y)} ${this.round(c2x)} ${this.round(c2y)} ${this.round(points[i + 1].x)} ${this.round(points[i + 1].y)}`;
        }

        return path;
    }

    private round(value: number): number {
        return Math.round(value * 100) / 100;
    }

    public formatFrequency(frequency: number): string {
        return frequency >= 1000 ? `${frequency / 1000}k` : `${frequency}`;
    }

    public formatGain(gain: number): string {
        return gain > 0 ? `+${gain}` : `${gain}`;
    }
}
