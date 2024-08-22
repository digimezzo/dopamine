const { DataDelimiter } = require('./data-delimiter');

class AlbumKeyGenerator {
    generateAlbumKey(albumTitle, albumArtists) {
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

    generateAlbumKey2(albumTitle) {
        if (albumTitle !== undefined && albumTitle.length > 0) {
            const albumKeyItems = [];
            albumKeyItems.push(albumTitle);

            return DataDelimiter.toDelimitedString(albumKeyItems);
        }

        return '';
    }

    generateAlbumKey3(folder) {
        if (folder !== undefined && folder.length > 0) {
            const albumKeyItems = [];
            albumKeyItems.push(folder);

            return DataDelimiter.toDelimitedString(albumKeyItems);
        }

        return '';
    }
}

exports.AlbumKeyGenerator = AlbumKeyGenerator;
