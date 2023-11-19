import { Injectable } from '@angular/core';
import { PlaybackServiceBase } from './playback.service.base';
import { AppearanceServiceBase } from '../appearance/appearance.service.base';
import { Theme } from '../appearance/theme/theme';
import { ColorConverter } from '../../common/color-converter';

@Injectable()
export class SpectrumAnalyzer {
    private readonly audioContext: AudioContext;
    private readonly analyser: AnalyserNode;
    private dataArray: Uint8Array;
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private frameRate: number = 10;

    public constructor(
        private playbackService: PlaybackServiceBase,
        private appearanceService: AppearanceServiceBase,
    ) {
        this.audioContext = new window.AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 128;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    public attachToCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.draw();
    }

    public connectAudioElement(): void {
        const source: MediaElementAudioSourceNode = this.playbackService.getSourceForAudioContext(this.audioContext);
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    private draw(): void {
        const drawFrame = () => {
            setTimeout(
                () => {
                    if (!this.playbackService.isPlaying) {
                        requestAnimationFrame(drawFrame);
                        return;
                    }

                    this.analyser.getByteFrequencyData(this.dataArray);
                    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

                    this.drawFlames();

                    requestAnimationFrame(drawFrame);
                },
                1000 / (this.playbackService.isPlaying ? this.frameRate : 1),
            );
        };

        drawFrame();
    }

    // private drawThinBars(): void {
    //     const barWidth: number = 1;
    //     const margin: number = 3;
    //     const offsetForLeftPart: number = this.canvas.width / 2 - (barWidth + margin) * this.dataArray.length;
    //     const offsetForRightPart: number = offsetForLeftPart + (barWidth + margin) * this.dataArray.length;
    //
    //     for (let i: number = 0; i < this.dataArray.length; i++) {
    //         const barHeightLeft: number = (this.dataArray[this.dataArray.length - 1 - i] / 255) * this.canvas.height;
    //         const barHeightRight: number = (this.dataArray[i + 1] / 255) * this.canvas.height;
    //         const xLeft: number = i * barWidth + offsetForLeftPart + margin * i;
    //         const xRight: number = i * barWidth + offsetForRightPart + margin * i;
    //         const yLeft: number = this.canvas.height - barHeightLeft;
    //         const yRight: number = this.canvas.height - barHeightRight;
    //
    //         const red: number = this.appearanceService.accentRgb[0];
    //         const green: number = this.appearanceService.accentRgb[1];
    //         const blue: number = this.appearanceService.accentRgb[2];
    //
    //         const alphaLeft: number = 1 - (this.canvas.height - barHeightLeft) / this.canvas.height;
    //         const alphaRight: number = 1 - (this.canvas.height - barHeightRight) / this.canvas.height;
    //
    //         // Left
    //         this.canvasContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alphaLeft})`;
    //         this.canvasContext.fillRect(xLeft, yLeft, barWidth, barHeightLeft);
    //
    //         // Right
    //         this.canvasContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alphaRight})`;
    //         this.canvasContext.fillRect(xRight, yRight, barWidth, barHeightRight);
    //     }
    // }

    // private drawRoundedBars(): void {
    //     const barWidth: number = 4;
    //     const margin: number = 2;
    //     const offsetForLeftPart: number = this.canvas.width / 2 - (barWidth + margin) * this.dataArray.length;
    //     const offsetForRightPart: number = offsetForLeftPart + (barWidth + margin) * this.dataArray.length;
    //
    //     for (let i: number = 0; i < this.dataArray.length; i++) {
    //         const barHeightLeft: number = (this.dataArray[this.dataArray.length - 1 - i] / 255) * this.canvas.height;
    //         const barHeightRight: number = (this.dataArray[i + 1] / 255) * this.canvas.height;
    //         const xLeft: number = i * barWidth + offsetForLeftPart + margin * i;
    //         const xRight: number = i * barWidth + offsetForRightPart + margin * i;
    //         const yLeft: number = this.canvas.height - barHeightLeft;
    //         const yRight: number = this.canvas.height - barHeightRight;
    //
    //         const red: number = this.appearanceService.accentRgb[0];
    //         const green: number = this.appearanceService.accentRgb[1];
    //         const blue: number = this.appearanceService.accentRgb[2];
    //
    //         const alphaLeft: number = 1 - (this.canvas.height - barHeightLeft) / this.canvas.height;
    //         const alphaRight: number = 1 - (this.canvas.height - barHeightRight) / this.canvas.height;
    //
    //         // Left
    //         this.canvasContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alphaLeft})`;
    //         this.canvasContext.roundRect(xLeft, yLeft, barWidth, barHeightLeft, [50, 50, 0, 0]);
    //         // this.canvasContext.fill();
    //
    //         // Right
    //         this.canvasContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alphaRight})`;
    //         this.canvasContext.roundRect(xRight, yRight, barWidth, barHeightRight, [50, 50, 0, 0]);
    //         this.canvasContext.fill();
    //     }
    // }

    // private drawFatBars(): void {
    //     const barWidth: number = 3;
    //     const margin: number = 1;
    //     const offsetForLeftPart: number = this.canvas.width / 2 - (barWidth + margin) * this.dataArray.length;
    //     const offsetForRightPart: number = offsetForLeftPart + (barWidth + margin) * this.dataArray.length;
    //
    //     for (let i: number = 0; i < this.dataArray.length; i++) {
    //         const barHeightLeft: number = (this.dataArray[this.dataArray.length - 1 - i] / 255) * this.canvas.height;
    //         const barHeightRight: number = (this.dataArray[i + 1] / 255) * this.canvas.height;
    //         const xLeft: number = i * barWidth + offsetForLeftPart + margin * i;
    //         const xRight: number = i * barWidth + offsetForRightPart + margin * i;
    //         const yLeft: number = this.canvas.height - barHeightLeft;
    //         const yRight: number = this.canvas.height - barHeightRight;
    //
    //         const red: number = this.appearanceService.accentRgb[0];
    //         const green: number = this.appearanceService.accentRgb[1];
    //         const blue: number = this.appearanceService.accentRgb[2];
    //
    //         const alphaLeft: number = 1 - (this.canvas.height - barHeightLeft) / this.canvas.height;
    //         const alphaRight: number = 1 - (this.canvas.height - barHeightRight) / this.canvas.height;
    //
    //         // Left
    //         this.canvasContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alphaLeft})`;
    //         this.canvasContext.fillRect(xLeft, yLeft, barWidth, barHeightLeft);
    //
    //         // Right
    //         this.canvasContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alphaRight})`;
    //         this.canvasContext.fillRect(xRight, yRight, barWidth, barHeightRight);
    //     }
    // }

    // private drawOriginalBars(): void {
    //     const barWidth: number = this.canvas.width / (this.dataArray.length * 2);
    //
    //     for (let i: number = 0; i < this.dataArray.length; i++) {
    //         const barHeightLeft: number = (this.dataArray[this.dataArray.length - 1 - i] / 255) * this.canvas.height;
    //         const barHeightRight: number = (this.dataArray[i + 1] / 255) * this.canvas.height;
    //         const xLeft: number = i * barWidth;
    //         const xRight: number = i * barWidth + this.canvas.width / 2;
    //         const yLeft: number = this.canvas.height - barHeightLeft;
    //         const yRight: number = this.canvas.height - barHeightRight;
    //
    //         const red: number = this.appearanceService.accentRgb[0];
    //         const green: number = this.appearanceService.accentRgb[1];
    //         const blue: number = this.appearanceService.accentRgb[2];
    //
    //         const alphaLeft: number = 1 - (this.canvas.height - barHeightLeft) / this.canvas.height;
    //         const alphaRight: number = 1 - (this.canvas.height - barHeightRight) / this.canvas.height;
    //
    //         // Left
    //         this.canvasContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alphaLeft})`;
    //         this.canvasContext.fillRect(xLeft, yLeft, barWidth, barHeightLeft);
    //
    //         // Right
    //         this.canvasContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alphaRight})`;
    //         this.canvasContext.fillRect(xRight, yRight, barWidth, barHeightRight);
    //     }
    // }

    // private drawSexyBars(): void {
    //     const barWidth: number = this.canvas.width / (this.dataArray.length * 2);
    //
    //     for (let i: number = 0; i < this.dataArray.length; i++) {
    //         const barHeightLeft: number = (this.dataArray[this.dataArray.length - 1 - i] / 255) * this.canvas.height;
    //         const barHeightRight: number = (this.dataArray[i + 1] / 255) * this.canvas.height;
    //         const xLeft: number = i * barWidth;
    //         const xRight: number = i * barWidth + this.canvas.width / 2;
    //         const yLeft: number = this.canvas.height - barHeightLeft;
    //         const yRight: number = this.canvas.height - barHeightRight;
    //
    //         const red: number = this.appearanceService.accentRgb[0];
    //         const green: number = this.appearanceService.accentRgb[1];
    //         const blue: number = this.appearanceService.accentRgb[2];
    //
    //         // Left
    //         this.canvasContext.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.15)`;
    //         this.canvasContext.fillRect(xLeft, yLeft + 5, barWidth, barHeightLeft);
    //         this.canvasContext.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.6)`;
    //         this.canvasContext.fillRect(xLeft, yLeft, barWidth, 5);
    //
    //         // Right
    //         this.canvasContext.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.15)`;
    //         this.canvasContext.fillRect(xRight, yRight + 5, barWidth, barHeightRight);
    //         this.canvasContext.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.6)`;
    //         this.canvasContext.fillRect(xRight, yRight, barWidth, 5);
    //     }
    // }

    // private drawGradientBars(): void {
    //     const barWidth: number = this.canvas.width / (this.dataArray.length * 2);
    //
    //     for (let i: number = 0; i < this.dataArray.length; i++) {
    //         const barHeightLeft: number = (this.dataArray[this.dataArray.length - 1 - i] / 255) * this.canvas.height;
    //         const barHeightRight: number = (this.dataArray[i + 1] / 255) * this.canvas.height;
    //         const xLeft: number = i * barWidth;
    //         const xRight: number = i * barWidth + this.canvas.width / 2;
    //         const yLeft: number = this.canvas.height - barHeightLeft;
    //         const yRight: number = this.canvas.height - barHeightRight;
    //
    //         const red: number = this.appearanceService.accentRgb[0];
    //         const green: number = this.appearanceService.accentRgb[1];
    //         const blue: number = this.appearanceService.accentRgb[2];
    //
    //         const gradient = this.canvasContext.createLinearGradient(0, 0, 0, this.canvas.height);
    //         // gradient.addColorStop(1, 'transparent');
    //         gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0.05)`);
    //         gradient.addColorStop(0.1, `rgb(${red}, ${green}, ${blue})`);
    //         this.canvasContext.fillStyle = gradient;
    //
    //         // Left
    //         this.canvasContext.fillRect(xLeft, yLeft, barWidth, barHeightLeft);
    //
    //         // Right
    //         this.canvasContext.fillRect(xRight, yRight, barWidth, barHeightRight);
    //     }
    // }

    private drawFlames(): void {
        const barWidth: number = this.canvas.width / (this.dataArray.length * 2);

        for (let i: number = 0; i < this.dataArray.length; i++) {
            const barHeightLeft: number = (this.dataArray[this.dataArray.length - 1 - i] / 255) * this.canvas.height;
            const barHeightRight: number = (this.dataArray[i] / 255) * this.canvas.height;
            const xLeft: number = i * barWidth;
            const xRight: number = i * barWidth + this.canvas.width / 2;
            const yLeft: number = this.canvas.height - barHeightLeft;
            const yRight: number = this.canvas.height - barHeightRight;

            const theme: Theme = this.appearanceService.selectedTheme;
            const primaryRgb: number[] = ColorConverter.stringToRgb(theme.coreColors.primaryColor);
            const secondaryRgb: number[] = ColorConverter.stringToRgb(theme.coreColors.secondaryColor);

            const primaryRed: number = primaryRgb[0];
            const primaryGreen: number = primaryRgb[1];
            const primaryBlue: number = primaryRgb[2];

            const secondaryRed: number = secondaryRgb[0];
            const secondaryGreen: number = secondaryRgb[1];
            const secondaryBlue: number = secondaryRgb[2];

            const tranparentBase: number = this.appearanceService.isUsingLightTheme ? 255 : 0;

            // Left
            const gradientLeft = this.canvasContext.createLinearGradient(xLeft, yLeft, xLeft, this.canvas.height);

            gradientLeft.addColorStop(0, `rgba(${tranparentBase}, ${tranparentBase}, ${tranparentBase}, 0)`);
            gradientLeft.addColorStop(0.3, `rgba(${secondaryRed}, ${secondaryGreen}, ${secondaryBlue}, 0.3)`);
            gradientLeft.addColorStop(1, `rgba(${primaryRed}, ${primaryGreen}, ${primaryBlue}, 0.3)`);

            this.canvasContext.fillStyle = gradientLeft;

            this.canvasContext.fillRect(xLeft - 4, yLeft, barWidth + 8, barHeightLeft);

            // Right
            const gradientRight = this.canvasContext.createLinearGradient(xRight, yRight, xRight, this.canvas.height);

            gradientRight.addColorStop(0, `rgba(${tranparentBase}, ${tranparentBase}, ${tranparentBase}, 0)`);
            gradientRight.addColorStop(0.3, `rgba(${secondaryRed}, ${secondaryGreen}, ${secondaryBlue}, 0.3)`);
            gradientRight.addColorStop(1, `rgba(${primaryRed}, ${primaryGreen}, ${primaryBlue}, 0.3)`);

            this.canvasContext.fillStyle = gradientRight;

            this.canvasContext.fillRect(xRight - 4, yRight, barWidth + 8, barHeightRight);
        }
    }
}
