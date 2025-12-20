import { GitHubApi } from './git-hub.api';
import { IMock, Mock, Times } from 'typemoq';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('GitHubApi', () => {
    let httpClientMock: IMock<HttpClient>;

    function createGitHubApi() {
        return new GitHubApi(httpClientMock.object);
    }

    beforeEach(() => {
        httpClientMock = Mock.ofType<HttpClient>();
    });

    describe('getLatestReleaseAsync', () => {
        it('should return first release when prereleases are included', async () => {
            // Arrange
            const gitHubApi = createGitHubApi();
            const url = 'https://api.github.com/repos/foo/bar/releases';

            httpClientMock
                .setup((x) => x.get<any[]>(url))
                .returns(() =>
                    of([
                        { prerelease: true, tag_name: 'v3.0.0-preview' },
                        { prerelease: false, tag_name: 'v2.0.0' },
                    ]),
                );

            // Act
            const result = await gitHubApi.getLatestReleaseAsync('foo', 'bar', true);

            // Assert
            expect(result).toBe('3.0.0-preview');
            httpClientMock.verify((x) => x.get<any[]>(url), Times.once());
        });

        it('should return first non-prerelease when prereleases are excluded', async () => {
            // Arrange
            const gitHubApi = createGitHubApi();
            const url = 'https://api.github.com/repos/foo/bar/releases';

            httpClientMock
                .setup((x) => x.get<any[]>(url))
                .returns(() =>
                    of([
                        { prerelease: true, tag_name: 'v3.0.0-preview' },
                        { prerelease: false, tag_name: 'v2.0.0' },
                        { prerelease: false, tag_name: 'v1.0.0' },
                    ]),
                );

            // Act
            const result = await gitHubApi.getLatestReleaseAsync('foo', 'bar', false);

            // Assert
            expect(result).toBe('2.0.0');
            httpClientMock.verify((x) => x.get<any[]>(url), Times.once());
        });

        it('should return empty string when only prereleases exist and prereleases are excluded', async () => {
            // Arrange
            const gitHubApi = createGitHubApi();
            const url = 'https://api.github.com/repos/foo/bar/releases';

            httpClientMock.setup((x) => x.get<any[]>(url)).returns(() => of([{ prerelease: true, tag_name: 'v2.0.0-preview' }]));

            // Act
            const result = await gitHubApi.getLatestReleaseAsync('foo', 'bar', false);

            // Assert
            expect(result).toBe('');
            httpClientMock.verify((x) => x.get<any[]>(url), Times.once());
        });

        it('should return empty string when tag_name is missing', async () => {
            // Arrange
            const gitHubApi = createGitHubApi();
            const url = 'https://api.github.com/repos/foo/bar/releases';

            httpClientMock.setup((x) => x.get<any[]>(url)).returns(() => of([{ prerelease: false }]));

            // Act
            const result = await gitHubApi.getLatestReleaseAsync('foo', 'bar', true);

            // Assert
            expect(result).toBe('');
            httpClientMock.verify((x) => x.get<any[]>(url), Times.once());
        });

        it('should return empty string when response is empty', async () => {
            // Arrange
            const gitHubApi = createGitHubApi();
            const url = 'https://api.github.com/repos/foo/bar/releases';

            httpClientMock.setup((x) => x.get<any[]>(url)).returns(() => of([]));

            // Act
            const result = await gitHubApi.getLatestReleaseAsync('foo', 'bar', true);

            // Assert
            expect(result).toBe('');
            httpClientMock.verify((x) => x.get<any[]>(url), Times.once());
        });
    });
});
