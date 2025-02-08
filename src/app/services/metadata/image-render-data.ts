export class ImageRenderData {
    public constructor(
        public readonly imageUrl: string,
        public readonly imageBuffer: Buffer | undefined,
    ) {}
}
