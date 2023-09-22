import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guards } from '../../guards';
import { Strings } from '../../strings';

@Injectable()
export class GitHubApi {
    public constructor(private httpClient: HttpClient) {}

    public async getLatestReleaseAsync(owner: string, repo: string, includePrereleases: boolean): Promise<string> {
        const url: string = `https://api.github.com/repos/${owner}/${repo}/releases`;
        const releasesResponse: any = await this.httpClient.get<any>(url).toPromise();

        let latestRelease: any = releasesResponse.find((x) => x.prerelease);

        if (includePrereleases) {
            latestRelease = releasesResponse.find((x) => <boolean>x.prerelease);
        } else {
            latestRelease = releasesResponse.find((x) => !(<boolean>x.prerelease));
        }

        if (Guards.isDefined(latestRelease) && Guards.isDefined(latestRelease.tag_name)) {
            return Strings.replaceFirst(latestRelease.tag_name, 'v', '');
        }

        return '';
    }
}
