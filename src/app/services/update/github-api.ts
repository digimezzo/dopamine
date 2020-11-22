import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GitHubApi {
    constructor(private httpClient: HttpClient) {
    }

    public async getLatestReleaseAsync(owner: string, repo: string): Promise<string> {
        const url: string = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
        const latestReleaseResponse: any = await this.httpClient.get<any>(url).toPromise();

        return latestReleaseResponse.tag_name.replace('v', '');
    }
}
