import { Injectable } from '@angular/core';
import { PlaybackServiceBase } from './playback.service.base';

@Injectable()
export class SpectrumAnalyzer {
    private audioContext: AudioContext;
    private readonly analyser: AnalyserNode;
    private readonly dataArray: Uint8Array;
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private frameRate: number = 25;

    public constructor(private playbackService: PlaybackServiceBase) {
        this.audioContext = new window.AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    public attachToCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.draw();
    }

    public connectAudioElement(): void {
        const source: MediaElementAudioSourceNode = this.audioContext.createMediaElementSource(this.playbackService.audio);
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    private draw(): void {
        const drawFrame = () => {
            setTimeout(() => {
                if (this.playbackService.audio.paused) {
                    requestAnimationFrame(drawFrame);
                    return;
                }

                this.analyser.getByteFrequencyData(this.dataArray);
                this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // this.drawThinBars();
                this.drawFatBars();

                requestAnimationFrame(drawFrame);
            }, 1000 / this.frameRate);
        };

        drawFrame();
    }

    private drawThinBars(): void {
        const barWidth: number = 1;
        const margin: number = 3;
        const offsetForLeftPart: number = this.canvas.width / 2 - (barWidth + margin) * this.dataArray.length;
        const offsetForRightPart: number = offsetForLeftPart + (barWidth + margin) * this.dataArray.length;

        for (let i: number = 0; i < this.dataArray.length; i++) {
            const barHeightLeft: number = (this.dataArray[this.dataArray.length - i] / 255) * this.canvas.height;
            const barHeightRight: number = (this.dataArray[i] / 255) * this.canvas.height;
            const xLeft: number = i * barWidth + offsetForLeftPart + margin * i;
            const xRight: number = i * barWidth + offsetForRightPart + margin * i;
            const yLeft: number = this.canvas.height - barHeightLeft;
            const yRight: number = this.canvas.height - barHeightRight;

            // Left
            this.canvasContext.fillStyle = `rgb(0, ${barHeightLeft}, 0)`;
            this.canvasContext.fillRect(xLeft, yLeft, barWidth, barHeightLeft);

            // Right
            this.canvasContext.fillStyle = `rgb(0, ${barHeightRight}, 0)`;
            this.canvasContext.fillRect(xRight, yRight, barWidth, barHeightRight);
        }
    }

    private drawFatBars(): void {
        const barWidth: number = this.canvas.width / (this.dataArray.length * 2);

        for (let i: number = 0; i < this.dataArray.length; i++) {
            const barHeightLeft: number = (this.dataArray[this.dataArray.length - i] / 255) * this.canvas.height;
            const barHeightRight: number = (this.dataArray[i] / 255) * this.canvas.height;
            const xLeft: number = i * barWidth;
            const xRight: number = i * barWidth + this.canvas.width / 2;
            const yLeft: number = this.canvas.height - barHeightLeft;
            const yRight: number = this.canvas.height - barHeightRight;

            // Left
            this.canvasContext.fillStyle = `rgb(0, ${barHeightLeft}, 0)`;
            this.canvasContext.fillRect(xLeft, yLeft, barWidth, barHeightLeft);

            // Right
            this.canvasContext.fillStyle = `rgb(0, ${barHeightRight}, 0)`;
            this.canvasContext.fillRect(xRight, yRight, barWidth, barHeightRight);
        }
    }
}
