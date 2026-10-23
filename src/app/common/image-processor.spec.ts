import { nativeImage } from 'electron';
import { Jimp } from 'jimp';
import decode from '@jsquash/webp/decode.js';
import { ImageProcessor } from './image-processor';
import { FileAccessBase } from './io/file-access.base';
import { Mock } from 'typemoq';

jest.mock('electron', () => ({ nativeImage: { createFromBuffer: jest.fn() } }));
jest.mock('@jsquash/webp/decode.js', () => ({ __esModule: true, default: jest.fn(), init: jest.fn() }));
jest.mock('@jsquash/webp/codec/dec/webp_dec.wasm', () => ({
    __esModule: true,
    default: 'data:application/wasm;base64,AGFzbQEAAAA=',
}));

describe('ImageProcessor', () => {
    const webpBuffer = Buffer.from('UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA', 'base64');
    let processor: ImageProcessor;

    beforeEach(() => {
        jest.clearAllMocks();
        (nativeImage.createFromBuffer as jest.Mock).mockReturnValue({ isEmpty: () => true });
        (decode as jest.Mock).mockResolvedValue({ width: 2, height: 2, data: new Uint8ClampedArray(16).fill(255) });
        processor = new ImageProcessor(Mock.ofType<FileAccessBase>().object);
    });

    it('should decode WebP artwork and resize it into a cached JPEG', async () => {
        const result = await processor.toResizedJpegBufferAsync(webpBuffer, 1, 1, 80);
        const image = await Jimp.read(result);

        expect(image.mime).toEqual('image/jpeg');
        expect(image.bitmap.width).toEqual(1);
        expect(image.bitmap.height).toEqual(1);
        expect(decode).toHaveBeenCalledWith(new Uint8Array(webpBuffer).buffer);
    });

    it('should convert WebP artwork to JPEG without resizing', async () => {
        const result = await processor.toJpegBufferAsync(webpBuffer, 80);
        const image = await Jimp.read(result);

        expect(image.mime).toEqual('image/jpeg');
        expect(image.bitmap.width).toEqual(2);
        expect(image.bitmap.height).toEqual(2);
    });

    it('should keep supporting PNG through the Jimp fallback', async () => {
        const pngBuffer = await new Jimp({ width: 2, height: 2, color: 0xffffffff }).getBuffer('image/png');
        const result = await processor.toJpegBufferAsync(pngBuffer, 80);

        expect((await Jimp.read(result)).mime).toEqual('image/jpeg');
        expect(decode).not.toHaveBeenCalled();
    });

    it('should keep using Electron when it can decode the artwork', async () => {
        const jpegBuffer = Buffer.from('jpeg');
        const toJPEG = jest.fn().mockReturnValue(jpegBuffer);
        (nativeImage.createFromBuffer as jest.Mock).mockReturnValue({ isEmpty: () => false, toJPEG });

        expect(await processor.toJpegBufferAsync(webpBuffer, 80)).toEqual(jpegBuffer);
        expect(toJPEG).toHaveBeenCalledWith(80);
        expect(decode).not.toHaveBeenCalled();
    });

    it('should reject artwork that cannot be decoded', async () => {
        await expect(processor.toJpegBufferAsync(Buffer.from('invalid artwork'), 80)).rejects.toThrow();
    });
});