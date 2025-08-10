import { Injectable } from '@angular/core';
import { TrackModel } from '../track/track-model';
import { ILyricsGetter } from './i-lyrics-getter';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { FileMetadataFactoryBase } from '../../common/metadata/file-metadata.factory.base';
import { StringUtils } from '../../common/utils/string-utils';

@Injectable()
export class EmbeddedLyricsGetter implements ILyricsGetter {
    public constructor(private fileMetadataFactory: FileMetadataFactoryBase) {}

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        const fileMetadata: IFileMetadata = await this.fileMetadataFactory.createAsync(track.path);

        if (StringUtils.isNullOrWhiteSpace(fileMetadata.lyrics)) {
            return LyricsModel.empty(track);
        }

        return LyricsModel.createSimple(track, '', LyricsSourceType.embedded, fileMetadata.lyrics);
    }
}
