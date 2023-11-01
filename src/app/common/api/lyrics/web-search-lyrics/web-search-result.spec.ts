import { WebSearchResult } from './web-search-result';

describe('WebSearchResult', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const instance: WebSearchResult = new WebSearchResult('https://www.my-lyrics.com/my/lyrics.html', 'www.my-lyrics.com');

            // Assert
            expect(instance).toBeDefined();
        });

        it('should set fullUrl', () => {
            // Arrange, Act
            const instance: WebSearchResult = new WebSearchResult('https://www.my-lyrics.com/my/lyrics.html', 'www.my-lyrics.com');

            // Assert
            expect(instance.fullUrl).toEqual('https://www.my-lyrics.com/my/lyrics.html');
        });

        it('should set name', () => {
            // Arrange, Act
            const instance: WebSearchResult = new WebSearchResult('https://www.my-lyrics.com/my/lyrics.html', 'www.my-lyrics.com');

            // Assert
            expect(instance.name).toEqual('my-lyrics');
        });
    });
});
