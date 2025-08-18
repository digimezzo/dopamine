import { GitHubApi } from './git-hub.api';
import { IMock, Mock, Times } from 'typemoq';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('GitHubApi', () => {
    let httpClientMock: IMock<HttpClient>;

    function createGitHubApi() {
        return new GitHubApi(httpClientMock.object);
    }

    beforeEach(() => {
        httpClientMock = Mock.ofType<HttpClient>();
    });

    describe('getLatestReleaseAsync', () => {
        ['v2.0.0-preview', '2.0.0-preview'].forEach((tag) => {
            it(`should return latest prerelease version for tag "${tag}"`, async () => {
                // Arrange
                const gitHubApi = createGitHubApi();

                const url = 'https://api.github.com/repos/foo/bar/releases';
                httpClientMock
                    .setup((x) => x.get<any>(url))
                    .returns(() =>
                        of([
                            {
                                prerelease: false,
                                tag_name: 'v3.0.0',
                            },
                            {
                                prerelease: true,
                                tag_name: `${tag}`,
                            },
                            {
                                prerelease: true,
                                tag_name: 'v1.0.0-preview',
                            },
                        ]),
                    );

                // Act
                const result = await gitHubApi.getLatestReleaseAsync('foo', 'bar', true);

                // Assert
                expect(result).toEqual('2.0.0-preview');
                httpClientMock.verify((x) => x.get<any>(url), Times.once());
            });
        });

        ['v3.0.0', '3.0.0'].forEach((tag) => {
            it(`should return latest release version for tag "${tag}"`, async () => {
                // Arrange
                const gitHubApi = createGitHubApi();

                const url = 'https://api.github.com/repos/foo/bar/releases';
                httpClientMock
                    .setup((x) => x.get<any>(url))
                    .returns(() =>
                        of([
                            {
                                prerelease: false,
                                tag_name: `${tag}`,
                            },
                            {
                                prerelease: true,
                                tag_name: 'v2.0.0-preview',
                            },
                            {
                                prerelease: true,
                                tag_name: 'v1.0.0-preview',
                            },
                        ]),
                    );

                // Act
                const result = await gitHubApi.getLatestReleaseAsync('foo', 'bar', false);

                // Assert
                expect(result).toEqual('3.0.0');
                httpClientMock.verify((x) => x.get<any>(url), Times.once());
            });
        });

        it('should return empty latest prerelease version when no prerelease versions', async () => {
            // Arrange
            const gitHubApi = createGitHubApi();

            const url = 'https://api.github.com/repos/foo/bar/releases';
            httpClientMock
                .setup((x) => x.get<any>(url))
                .returns(() =>
                    of([
                        {
                            prerelease: false,
                            tag_name: 'v1.0.0',
                        },
                    ]),
                );

            // Act
            const result = await gitHubApi.getLatestReleaseAsync('foo', 'bar', true);

            // Assert
            expect(result).toEqual('');
            httpClientMock.verify((x) => x.get<any>(url), Times.once());
        });

        it('should return empty latest prerelease version when no tag', async () => {
            // Arrange
            const gitHubApi = createGitHubApi();

            const url = 'https://api.github.com/repos/foo/bar/releases';
            httpClientMock
                .setup((x) => x.get<any>(url))
                .returns(() =>
                    of([
                        {
                            prerelease: true,
                        },
                    ]),
                );

            // Act
            const result = await gitHubApi.getLatestReleaseAsync('foo', 'bar', true);

            // Assert
            expect(result).toEqual('');
            httpClientMock.verify((x) => x.get<any>(url), Times.once());
        });

        it('should return empty latest prerelease version when empty response', async () => {
            // Arrange
            const gitHubApi = createGitHubApi();

            const url = 'https://api.github.com/repos/foo/bar/releases';
            httpClientMock.setup((x) => x.get<any>(url)).returns(() => of([]));

            // Act
            const result = await gitHubApi.getLatestReleaseAsync('foo', 'bar', true);

            // Assert
            expect(result).toEqual('');
            httpClientMock.verify((x) => x.get<any>(url), Times.once());
        });

        it('should throw an exception when http client fails for latest prerelease', async () => {
            // Arrange
            const gitHubApi = createGitHubApi();

            const url = 'https://api.github.com/repos/foo/bar/releases';
            const error = new Error('An error occurred');
            httpClientMock.setup((x) => x.get<any>(url)).throws(error);

            // Act, Assert
            await expect(gitHubApi.getLatestReleaseAsync('foo', 'bar', true)).rejects.toThrow(error);
            httpClientMock.verify((x) => x.get<any>(url), Times.once());
        });

        it('should return empty latest release version when no release versions', async () => {
            // Arrange
            const gitHubApi = createGitHubApi();

            const url = 'https://api.github.com/repos/foo/bar/releases';
            httpClientMock
                .setup((x) => x.get<any>(url))
                .returns(() =>
                    of([
                        {
                            prerelease: true,
                            tag_name: 'v1.0.0',
                        },
                    ]),
                );

            // Act
            const result = await gitHubApi.getLatestReleaseAsync('foo', 'bar', false);

            // Assert
            expect(result).toEqual('');
            httpClientMock.verify((x) => x.get<any>(url), Times.once());
        });

        it('should return empty latest release version when no tag', async () => {
            // Arrange
            const gitHubApi = createGitHubApi();

            const url = 'https://api.github.com/repos/foo/bar/releases';
            httpClientMock
                .setup((x) => x.get<any>(url))
                .returns(() =>
                    of([
                        {
                            prerelease: false,
                        },
                    ]),
                );

            // Act
            const result = await gitHubApi.getLatestReleaseAsync('foo', 'bar', false);

            // Assert
            expect(result).toEqual('');
            httpClientMock.verify((x) => x.get<any>(url), Times.once());
        });

        it('should return empty latest release version when empty response', async () => {
            // Arrange
            const gitHubApi = createGitHubApi();

            const url = 'https://api.github.com/repos/foo/bar/releases';
            httpClientMock.setup((x) => x.get<any>(url)).returns(() => of([]));

            // Act
            const result = await gitHubApi.getLatestReleaseAsync('foo', 'bar', false);

            // Assert
            expect(result).toEqual('');
            httpClientMock.verify((x) => x.get<any>(url), Times.once());
        });

        it('should throw an exception when http client fails for latest release', async () => {
            // Arrange
            const gitHubApi = createGitHubApi();

            const url = 'https://api.github.com/repos/foo/bar/releases';
            const error = new Error('An error occurred');
            httpClientMock.setup((x) => x.get<any>(url)).throws(error);

            // Act, Assert
            await expect(gitHubApi.getLatestReleaseAsync('foo', 'bar', false)).rejects.toThrow(error);
            httpClientMock.verify((x) => x.get<any>(url), Times.once());
        });
    });
});
