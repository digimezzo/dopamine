const { StringUtils } = require('../utils/string-utils');

class LastfmAlbum {
    constructor() {
        this.name = '';
        this.artist = '';
        this.url = '';
        this.imageSmall = '';
        this.imageMedium = '';
        this.imageLarge = '';
        this.imageExtraLarge = '';
        this.imageMega = '';
    }

    largestImage() {
        if (!StringUtils.isNullOrWhiteSpace(this.imageMega)) {
            return this.imageMega;
        }

        if (!StringUtils.isNullOrWhiteSpace(this.imageExtraLarge)) {
            return this.imageExtraLarge;
        }

        if (!StringUtils.isNullOrWhiteSpace(this.imageLarge)) {
            return this.imageLarge;
        }

        if (!StringUtils.isNullOrWhiteSpace(this.imageMedium)) {
            return this.imageMedium;
        }

        if (!StringUtils.isNullOrWhiteSpace(this.imageSmall)) {
            return this.imageSmall;
        }

        return '';
    }
}

exports.LastfmAlbum = LastfmAlbum;
