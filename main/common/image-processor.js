const { FileAccess } = require('./file-access');
const fs = require('fs-extra');
const Jimp = require('jimp');

class ImageProcessor {
    static async convertOnlineImageToBufferAsync(imageUrl) {
        const response = await fetch(imageUrl);
        const imageArrayBuffer = await response.arrayBuffer();
        return Buffer.from(imageArrayBuffer);
    }

    static async convertLocalImageToBufferAsync(imagePath) {
        return await FileAccess.getFileContentAsBufferAsync(imagePath);
    }

    static async resizeImageAsync(imageBuffer, maxWidth, maxHeight, jpegQuality) {
        let image = await Jimp.read(imageBuffer);

        if (image.bitmap.width > maxWidth || image.bitmap.height > maxHeight) {
            await image.resize(maxWidth, maxHeight);
        }

        return await image.getBufferAsync(Jimp.MIME_JPEG);
    }

    static async convertImageBufferToFileAsync(imageBuffer, imagePath) {
        await fs.writeFile(imagePath, imageBuffer);
    }
}

exports.ImageProcessor = ImageProcessor;
