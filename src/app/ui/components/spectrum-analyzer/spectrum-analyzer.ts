/* eslint-disable @typescript-eslint/ban-ts-comment */
/*  eslint-disable @typescript-eslint/strict-boolean-expressions */
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
import { Injectable } from '@angular/core';

@Injectable()
export class SpectrumAnalyzer {
    private audioContext: AudioContext;
    private analyser: AnalyserNode;
    private dataArray: Uint8Array;
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;

    public constructor() {
        // @ts-ignore
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256; // Adjust the FFT size as needed for your application
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    public init(canvasId: string): void {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.draw();
    }

    public connectAudioElement(audioElement: HTMLAudioElement): void {
        const source: MediaElementAudioSourceNode = this.audioContext.createMediaElementSource(audioElement);
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    private draw(): void {
        const drawFrame = () => {
            this.analyser.getByteFrequencyData(this.dataArray);

            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const barWidth: number = this.canvas.width / this.dataArray.length;

            for (let i: number = 0; i < this.dataArray.length; i++) {
                const barHeight: number = (this.dataArray[i] / 255) * this.canvas.height;
                const x: number = i * barWidth;
                const y: number = this.canvas.height - barHeight;

                this.canvasContext.fillStyle = `rgb(0, ${barHeight}, 0)`;
                this.canvasContext.fillRect(x, y, barWidth, barHeight);
            }

            requestAnimationFrame(drawFrame);
        };

        drawFrame();
    }
}
