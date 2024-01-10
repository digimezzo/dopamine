const { DataDelimiter } = require('./data-delimiter');

class AlbumKeyGenerator {
    static generateAlbumKey(albumTitle, albumArtists) {
        if (albumTitle !== undefined && albumTitle.length > 0) {
            const albumKeyItems = [];
            albumKeyItems.push(albumTitle);

            if (albumArtists !== undefined && albumArtists.length > 0) {
                albumKeyItems.push(...albumArtists);
            }

            return DataDelimiter.toDelimitedString(albumKeyItems);
        }

        return '';
    }
}

exports.AlbumKeyGenerator = AlbumKeyGenerator;
