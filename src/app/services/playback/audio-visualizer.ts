import { Injectable } from '@angular/core';
import { AppearanceServiceBase } from '../appearance/appearance.service.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { AudioPlayerBase } from './audio-player.base';
import { RgbColor } from '../../common/rgb-color';

@Injectable()
export class AudioVisualizer {
    private dataArray: Uint8Array;
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private isStopped: boolean;
    private stopRequestTime: Date | undefined;

    public constructor(
        private audioPlayer: AudioPlayerBase,
        private appearanceService: AppearanceServiceBase,
        private settings: SettingsBase,
    ) {}

    public connectAudioElement(): void {
        this.dataArray = new Uint8Array(this.audioPlayer.analyser.frequencyBinCount);
        this.analyze();
    }

    public connectCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    private shouldStopDelayed(): boolean {
        return this.audioPlayer.isPaused;
    }

    private shouldStopNow(): boolean {
        return !this.settings.showAudioVisualizer;
    }

    private analyze(): void {
        setTimeout(
            () => {
                this.audioPlayer.analyser.getByteFrequencyData(this.dataArray);
                this.draw();

                requestAnimationFrame(() => this.analyze());
            },
            1000 / (!this.isStopped ? this.settings.audioVisualizerFrameRate : 1),
        );
    }

    private draw(): void {
        if (this.canvasContext == undefined) {
            return;
        }

        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.shouldStopNow()) {
            this.stopRequestTime = undefined;
            this.isStopped = true;
            return;
        } else if (this.shouldStopDelayed()) {
            if (this.isStopped) {
                return;
            }

            if (this.stopRequestTime == undefined) {
                this.stopRequestTime = new Date();
            } else {
                const differenceInSeconds: number = Math.abs((new Date().getTime() - this.stopRequestTime.getTime()) / 1000);

                if (differenceInSeconds > 5) {
                    this.stopRequestTime = undefined;
                    this.isStopped = true;
                    return;
                }
            }
        } else {
            this.stopRequestTime = undefined;
            this.isStopped = false;
        }

        switch (this.settings.audioVisualizerStyle) {
            case 'flames':
                this.drawFlames();
                break;
            case 'lines':
                this.drawLines();
                break;
            case 'bars':
                this.drawBars();
                break;
            default:
                this.drawFlames();
                break;
        }
    }

    private drawFlames(): void {
        const barWidth: number = this.canvas.width / (this.dataArray.length * 2);
        const canvasCenter: number = this.canvas.width / 2;
        const accentRgbColor: RgbColor = this.appearanceService.accentRgbColor;
        const backgroundRgbColor: RgbColor = this.appearanceService.backgroundRgbColor;

        for (let i: number = 0; i < this.dataArray.length; i++) {
            const barHeight: number = (this.dataArray[i] / 255) * this.canvas.height;
            const xLeft: number = canvasCenter - barWidth / 2 - i * barWidth;
            const xRight: number = canvasCenter - barWidth / 2 + i * barWidth;
            const y: number = this.canvas.height - barHeight;

            // Left
            if (i > 0) {
                const gradientLeft = this.canvasContext.createLinearGradient(xLeft, y, xLeft, this.canvas.height);
                gradientLeft.addColorStop(
                    0,
                    `rgba(${backgroundRgbColor.red}, ${backgroundRgbColor.green}, ${backgroundRgbColor.blue}, 0.2)`,
                );
                gradientLeft.addColorStop(0.8, `rgba(${accentRgbColor.red}, ${accentRgbColor.green}, ${accentRgbColor.blue}, 0.8)`);

                this.canvasContext.fillStyle = gradientLeft;
                this.canvasContext.fillRect(xLeft - 4, y, barWidth + 8, barHeight);
            }

            // Right
            const gradientRight = this.canvasContext.createLinearGradient(xRight, y, xRight, this.canvas.height);
            gradientRight.addColorStop(0, `rgba(${backgroundRgbColor.red}, ${backgroundRgbColor.green}, ${backgroundRgbColor.blue}, 0.2)`);
            gradientRight.addColorStop(0.8, `rgba(${accentRgbColor.red}, ${accentRgbColor.green}, ${accentRgbColor.blue}, 0.8)`);

            this.canvasContext.fillStyle = gradientRight;
            this.canvasContext.fillRect(xRight - 4, y, barWidth + 8, barHeight);
        }
    }

    private drawLines(): void {
        const barWidth: number = 1;
        const barMargin: number = 3;
        const totalBarWidth: number = barWidth + barMargin;
        const canvasCenter: number = this.canvas.width / 2;
        const accentRgbColor: RgbColor = this.appearanceService.accentRgbColor;

        for (let i: number = 0; i < this.dataArray.length; i++) {
            const barHeight: number = (this.dataArray[i] / 255) * this.canvas.height;
            const xLeft: number = canvasCenter - totalBarWidth / 2 - i * (barWidth + barMargin);
            const xRight: number = canvasCenter - totalBarWidth / 2 + i * (barWidth + barMargin);
            const y: number = this.canvas.height - barHeight;

            const alphaLeft: number = 1 - (this.canvas.height - barHeight) / this.canvas.height;
            const alphaRight: number = 1 - (this.canvas.height - barHeight) / this.canvas.height;

            // Left
            if (i > 0) {
                this.canvasContext.fillStyle = `rgba(${accentRgbColor.red}, ${accentRgbColor.green}, ${accentRgbColor.blue}, ${alphaLeft})`;
                this.canvasContext.fillRect(xLeft, y, barWidth, barHeight);
            }

            // Right
            this.canvasContext.fillStyle = `rgba(${accentRgbColor.red}, ${accentRgbColor.green}, ${accentRgbColor.blue}, ${alphaRight})`;
            this.canvasContext.fillRect(xRight, y, barWidth, barHeight);
        }
    }

    private drawBars(): void {
        const barWidth: number = 3;
        const barMargin: number = 2;
        const totalBarWidth: number = barWidth + barMargin;
        const canvasCenter: number = this.canvas.width / 2;
        const accentRgbColor: RgbColor = this.appearanceService.accentRgbColor;

        for (let i: number = 0; i < this.dataArray.length; i++) {
            const barHeight: number = (this.dataArray[i] / 255) * this.canvas.height;
            const xLeft: number = canvasCenter - totalBarWidth / 2 - i * (barWidth + barMargin);
            const xRight: number = canvasCenter - totalBarWidth / 2 + i * (barWidth + barMargin);
            const y: number = this.canvas.height - barHeight;

            const alphaLeft: number = 1 - (this.canvas.height - barHeight) / this.canvas.height;
            const alphaRight: number = 1 - (this.canvas.height - barHeight) / this.canvas.height;

            // Left
            if (i > 0) {
                this.canvasContext.fillStyle = `rgba(${accentRgbColor.red}, ${accentRgbColor.green}, ${accentRgbColor.blue}, ${alphaLeft})`;
                this.canvasContext.fillRect(xLeft, y, barWidth, barHeight);
            }

            // Right
            this.canvasContext.fillStyle = `rgba(${accentRgbColor.red}, ${accentRgbColor.green}, ${accentRgbColor.blue}, ${alphaRight})`;
            this.canvasContext.fillRect(xRight, y, barWidth, barHeight);
        }
    }

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

    // private drawFlames(): void {
    //     const barWidth: number = this.canvas.width / (this.dataArray.length * 2);
    //
    //     for (let i: number = 0; i < this.dataArray.length; i++) {
    //         const barHeightLeft: number = (this.dataArray[this.dataArray.length - 1 - i] / 255) * this.canvas.height;
    //         const barHeightRight: number = (this.dataArray[i] / 255) * this.canvas.height;
    //         const xLeft: number = i * barWidth;
    //         const xRight: number = i * barWidth + this.canvas.width / 2;
    //         const yLeft: number = this.canvas.height - barHeightLeft;
    //         const yRight: number = this.canvas.height - barHeightRight;
    //
    //         const theme: Theme = this.appearanceService.selectedTheme;
    //         const primaryRgb: number[] = ColorConverter.stringToRgb(theme.coreColors.primaryColor);
    //         const secondaryRgb: number[] = ColorConverter.stringToRgb(theme.coreColors.secondaryColor);
    //
    //         const primaryRed: number = primaryRgb[0];
    //         const primaryGreen: number = primaryRgb[1];
    //         const primaryBlue: number = primaryRgb[2];
    //
    //         const secondaryRed: number = secondaryRgb[0];
    //         const secondaryGreen: number = secondaryRgb[1];
    //         const secondaryBlue: number = secondaryRgb[2];
    //
    //         const tranparentBase: number = this.appearanceService.isUsingLightTheme ? 255 : 0;
    //
    //         // Left
    //         const gradientLeft = this.canvasContext.createLinearGradient(xLeft, yLeft, xLeft, this.canvas.height);
    //
    //         gradientLeft.addColorStop(0, `rgba(${tranparentBase}, ${tranparentBase}, ${tranparentBase}, 0)`);
    //         gradientLeft.addColorStop(0.3, `rgba(${secondaryRed}, ${secondaryGreen}, ${secondaryBlue}, 0.3)`);
    //         gradientLeft.addColorStop(1, `rgba(${primaryRed}, ${primaryGreen}, ${primaryBlue}, 0.3)`);
    //
    //         this.canvasContext.fillStyle = gradientLeft;
    //
    //         this.canvasContext.fillRect(xLeft - 4, yLeft, barWidth + 8, barHeightLeft);
    //
    //         // Right
    //         const gradientRight = this.canvasContext.createLinearGradient(xRight, yRight, xRight, this.canvas.height);
    //
    //         gradientRight.addColorStop(0, `rgba(${tranparentBase}, ${tranparentBase}, ${tranparentBase}, 0)`);
    //         gradientRight.addColorStop(0.3, `rgba(${secondaryRed}, ${secondaryGreen}, ${secondaryBlue}, 0.3)`);
    //         gradientRight.addColorStop(1, `rgba(${primaryRed}, ${primaryGreen}, ${primaryBlue}, 0.3)`);
    //
    //         this.canvasContext.fillStyle = gradientRight;
    //
    //         this.canvasContext.fillRect(xRight - 4, yRight, barWidth + 8, barHeightRight);
    //     }
    // }
}
