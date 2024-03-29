/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StringUtils } from '../../utils/string-utils';

@Injectable()
export class GitHubApi {
    public constructor(private httpClient: HttpClient) {}

    public async getLatestReleaseAsync(owner: string, repo: string, includePrereleases: boolean): Promise<string> {
        const url: string = `https://api.github.com/repos/${owner}/${repo}/releases`;
        const releasesResponse: any = await this.httpClient.get<any>(url).toPromise();

        let latestRelease: any = releasesResponse.find((x) => x.prerelease);

        if (includePrereleases) {
            latestRelease = releasesResponse.find((x) => x.prerelease);
        } else {
            latestRelease = releasesResponse.find((x) => !x.prerelease);
        }

        if (latestRelease != undefined && latestRelease.tag_name != undefined) {
            return StringUtils.replaceFirst(latestRelease.tag_name, 'v', '');
        }

        return '';
    }
}
