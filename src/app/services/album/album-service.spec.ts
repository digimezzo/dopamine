import { IMock, Mock } from 'typemoq';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { BaseAlbumArtworkCacheService } from '../album-artwork-cache/base-album-artwork-cache.service';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { AlbumService } from './album-service';

describe('AlbumService', () => {
    let trackRepositoryMock: IMock<BaseTrackRepository>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService>;
    let service: AlbumService;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();
        albumArtworkCacheServiceMock = Mock.ofType<BaseAlbumArtworkCacheService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        service = new AlbumService(trackRepositoryMock.object, translatorServiceMock.object, albumArtworkCacheServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });
});
