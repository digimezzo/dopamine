const { FileAccess } = require('./file-access');
const { nativeImage } = require('electron');
const fs = require('fs-extra');

class ImageProcessor {
    static async convertOnlineImageToBufferAsync(imageUrl) {
        const response = await fetch(imageUrl);
        const imageArrayBuffer = await response.arrayBuffer();
        return Buffer.from(imageArrayBuffer);
    }

    static async convertLocalImageToBufferAsync(imagePath) {
        return await FileAccess.getFileContentAsBufferAsync(imagePath);
    }

    static resizeImage(imageBuffer, maxWidth, maxHeight, jpegQuality) {
        let image = nativeImage.createFromBuffer(imageBuffer);
        const imageSize = image.getSize();

        if (imageSize.width > maxWidth || imageSize.height > maxHeight) {
            image = image.resize({ width: maxWidth, height: maxHeight, quality: 'best' });
        }

        return image.toJPEG(jpegQuality);
    }

    static async convertImageBufferToFileAsync(imageBuffer, imagePath) {
        await fs.writeFile(imagePath, imageBuffer);
    }
}

exports.ImageProcessor = ImageProcessor;
