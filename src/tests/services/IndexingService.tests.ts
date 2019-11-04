import { IndexingService } from "../../app/services/indexing/indexing.service";
import * as assert from 'assert';
import { Settings } from "../../app/core/settings";
import * as TypeMoq from "typemoq";
import { Times } from "typemoq";

describe('IndexingService', () => {
    it('myTest_NoParameters_ReturnsHello', () => {
        // Arrange
        var settingsStub = TypeMoq.Mock.ofType<Settings>();
        let service: IndexingService = new IndexingService(settingsStub.object);

        // Act
        service.myTest();

        // Assert
        // assert.equal('Hello', service.myTest());
        settingsStub.verify(x => x.showWelcome, Times.atLeastOnce());
    });
});