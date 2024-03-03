const fs = require('fs-extra');
const sharp = require('sharp');

class ImageProcessor {
    constructor(fileAccess) {
        this.fileAccess = fileAccess;
    }
    async convertOnlineImageToBufferAsync(imageUrl) {
        const response = await fetch(imageUrl);
        const imageArrayBuffer = await response.arrayBuffer();
        return Buffer.from(imageArrayBuffer);
    }

    async convertLocalImageToBufferAsync(imagePath) {
        return await this.fileAccess.getFileContentAsBufferAsync(imagePath);
    }

    async toResizedJpegFileAsync(imageBuffer, imagePath, maxWidth, maxHeight, jpegQuality) {
        await sharp(imageBuffer)
            .resize(maxWidth, maxHeight)
            .jpeg({
                quality: jpegQuality,
            })
            .toFile(imagePath);
    }
}

exports.ImageProcessor = ImageProcessor;
