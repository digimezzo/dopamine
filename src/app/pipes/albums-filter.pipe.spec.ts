import { IMock, Mock } from 'typemoq';
import { BaseSearchService } from '../services/search/base-search.service';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { AlbumsFilterPipe } from './albums-filter.pipe';

describe('AlbumsFilterPipe', () => {
    let searchServiceMock: IMock<BaseSearchService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    function createPipe(): AlbumsFilterPipe {
        return new AlbumsFilterPipe(searchServiceMock.object);
    }

    beforeEach(() => {
        searchServiceMock = Mock.ofType<BaseSearchService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
    });

    describe('transform', () => {});
});
