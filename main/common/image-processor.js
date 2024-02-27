const fs = require('fs-extra');
const Jimp = require('jimp');

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

    async resizeAndWriteImageAsync(imageBuffer, imagePath, maxWidth, maxHeight, jpegQuality) {
        let image = await Jimp.read(imageBuffer);

        if (image.bitmap.width > maxWidth || image.bitmap.height > maxHeight) {
            await image.resize(maxWidth, maxHeight);
        }

        await image.quality(jpegQuality).writeAsync(imagePath);
    }
}

exports.ImageProcessor = ImageProcessor;
