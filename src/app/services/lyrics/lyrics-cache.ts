import { Injectable } from '@angular/core';
import { createHash, randomBytes } from 'crypto';
import * as fs from 'fs-extra';
import * as path from 'path';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { DesktopBase } from '../../common/io/desktop.base';
import { Logger } from '../../common/logger';
import { StringUtils } from '../../common/utils/string-utils';
import { TrackModel } from '../track/track-model';
import { LyricsModel } from './lyrics-model';

@Injectable({ providedIn: 'root' })
export class LyricsCache {
    public constructor(
        private desktop: DesktopBase,
        private logger: Logger,
    ) {}

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        try {
            const cachePath = await this.getCachePathAsync(track);

            if (cachePath !== undefined) {
                const entry = await fs.readJson(cachePath);

                if (
                    typeof entry?.sourceName === 'string' &&
                    typeof entry.text === 'string' &&
                    !StringUtils.isNullOrWhiteSpace(entry.text)
                ) {
                    return LyricsModel.plain(track, entry.sourceName, LyricsSourceType.online, entry.text);
                }
            }
        } catch (e: unknown) {
            if ((e as NodeJS.ErrnoException | undefined)?.code !== 'ENOENT') {
                this.logger.error(e, 'Could not read cached lyrics', 'LyricsCache', 'getLyricsAsync');
            }
        }

        return LyricsModel.empty(track);
    }

    public async saveLyricsAsync(track: TrackModel, lyrics: LyricsModel): Promise<void> {
        if (lyrics.sourceType !== LyricsSourceType.online || StringUtils.isNullOrWhiteSpace(lyrics.plainText)) {
            return;
        }

        try {
            const cachePath = await this.getCachePathAsync(track);

            if (cachePath === undefined) {
                return;
            }

            await fs.ensureDir(path.dirname(cachePath));
            const tempPath = `${cachePath}.${randomBytes(8).toString('hex')}.tmp`;

            try {
                await fs.writeJson(tempPath, { sourceName: lyrics.sourceName, text: lyrics.plainText });
                await fs.rename(tempPath, cachePath);
            } finally {
                await fs.remove(tempPath);
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not save downloaded lyrics', 'LyricsCache', 'saveLyricsAsync');
        }
    }

    private async getCachePathAsync(track: TrackModel): Promise<string | undefined> {
        const artist = track.rawFirstArtist;
        const title = track.rawTitle;

        if (StringUtils.isNullOrWhiteSpace(artist) || StringUtils.isNullOrWhiteSpace(title)) {
            return undefined;
        }

        // Use song tags so a rescan or a moved file can find the same entry.
        const tags = [artist, title, track.rawAlbumTitle].map((tag) => tag.trim().normalize('NFC'));
        const key = createHash('sha256').update(JSON.stringify(tags)).digest('hex');
        const musicDirectory = this.desktop.getMusicDirectory();
        const directory =
            !StringUtils.isNullOrWhiteSpace(musicDirectory) && (await fs.pathExists(musicDirectory))
                ? path.join(musicDirectory, 'Dopamine', 'Lyrics')
                : path.join(this.desktop.getApplicationDataDirectory(), 'Lyrics');

        return path.join(directory, `${key}.json`);
    }
}
