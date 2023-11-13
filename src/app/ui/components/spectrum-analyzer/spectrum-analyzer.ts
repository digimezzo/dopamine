export class SpectrumAnalyzer {
    private audioContext: AudioContext;
    private analyser: AnalyserNode;
    private dataArray: Uint8Array;
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;

    constructor(audioElement: HTMLAudioElement, canvasId: string) {
        // @ts-ignore
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256; // Adjust the FFT size as needed for your application
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.connectAudioElement(audioElement);
        this.connectAnalyser();
        this.draw();
    }

    private connectAudioElement(audioElement: HTMLAudioElement): void {
        const source = this.audioContext.createMediaElementSource(audioElement);
        source.connect(this.analyser);
        source.connect(this.audioContext.destination);
    }

    private connectAnalyser(): void {
        this.analyser.connect(this.audioContext.destination);
    }

    private draw(): void {
        const drawFrame = () => {
            this.analyser.getByteFrequencyData(this.dataArray);

            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const barWidth = this.canvas.width / this.dataArray.length;

            for (let i = 0; i < this.dataArray.length; i++) {
                const barHeight = (this.dataArray[i] / 255) * this.canvas.height;
                const x = i * barWidth;
                const y = this.canvas.height - barHeight;

                this.canvasContext.fillStyle = `rgb(0, ${barHeight}, 0)`;
                this.canvasContext.fillRect(x, y, barWidth, barHeight);
            }

            requestAnimationFrame(drawFrame);
        };

        drawFrame();
    }
}
