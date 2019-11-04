import { IndexingService } from "../../app/services/indexing/indexing.service";
import * as assert from 'assert';

describe('IndexingService', () => {
        it('myTest_NoParameters_ReturnsHello', () => {
            let service: IndexingService = new IndexingService();
            assert.equal('Hello', service.myTest());
        });
});