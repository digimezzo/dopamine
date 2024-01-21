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

    async resizeImageAsync(imageBuffer, maxWidth, maxHeight, jpegQuality) {
        let image = await Jimp.read(imageBuffer);

        if (image.bitmap.width > maxWidth || image.bitmap.height > maxHeight) {
            await image.resize(maxWidth, maxHeight);
        }

        return await image.getBufferAsync(Jimp.MIME_JPEG);
    }

    async convertImageBufferToFileAsync(imageBuffer, imagePath) {
        await fs.writeFile(imagePath, imageBuffer);
    }
}

exports.ImageProcessor = ImageProcessor;
