class ImageProcessorMock {
    convertOnlineImageToBufferAsyncReturnValues = {};
    convertLocalImageToBufferAsyncReturnValues = {};
    resizeImageAsyncReturnValues = {};
    convertImageBufferToFileAsyncShouldThrowError = false;

    async convertOnlineImageToBufferAsync(imageUrl) {
        return this.convertOnlineImageToBufferAsyncReturnValues[imageUrl];
    }

    async convertLocalImageToBufferAsync(imagePath) {
        return this.convertLocalImageToBufferAsyncReturnValues[imagePath];
    }

    async resizeImageAsync(imageBuffer, maxWidth, maxHeight, jpegQuality) {
        return this.resizeImageAsyncReturnValues[`${imageBuffer};${maxWidth};${maxHeight};${jpegQuality}`];
    }

    async convertImageBufferToFileAsync(imageBuffer, imagePath) {
        if (this.convertImageBufferToFileAsyncShouldThrowError) {
            throw new Error('Error while converting image buffer to file');
        }
    }
}

exports.ImageProcessorMock = ImageProcessorMock;
