import { AlbumData } from '../../data/album-data';
import { AlbumModel } from './album-model';

describe('TrackModel', () => {
    let albumData: AlbumData;
    let albumModel: AlbumModel;

    beforeEach(() => {
        albumModel = new AlbumModel(albumData);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(albumModel).toBeDefined();
        });
    });
});
