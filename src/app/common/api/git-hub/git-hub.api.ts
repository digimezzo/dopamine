/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GitHubApi {
    private readonly _tagPrefix = 'v';

    public constructor(private httpClient: HttpClient) {}

    public async getLatestReleaseAsync(owner: string, repo: string, includePrereleases: boolean): Promise<string> {
        const url = `https://api.github.com/repos/${owner}/${repo}/releases`;
        const releases = await this.httpClient.get<any[]>(url).toPromise();

        if (!Array.isArray(releases)) {
            return '';
        }

        // Filter only when prereleases should be excluded
        const filtered = includePrereleases ? releases : releases.filter((r) => !r.prerelease);

        if (filtered.length === 0) {
            return '';
        }

        // GitHub already returns newest first
        const latestRelease = filtered[0];

        const tag = latestRelease.tag_name;
        if (!tag) {
            return '';
        }

        return tag.startsWith(this._tagPrefix) ? tag.substring(this._tagPrefix.length) : tag;
    }
}
