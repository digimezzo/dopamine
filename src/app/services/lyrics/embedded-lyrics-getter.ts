import { Injectable } from '@angular/core';
import { TrackModel } from '../track/track-model';
import { ILyricsGetter } from './i-lyrics-getter';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { FileMetadataFactoryBase } from '../../common/metadata/file-metadata.factory.base';

@Injectable()
export class EmbeddedLyricsGetter implements ILyricsGetter {
    public constructor(private fileMetadataFactory: FileMetadataFactoryBase) {}

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        const fileMetadata: IFileMetadata = await this.fileMetadataFactory.createAsync(track.path);

        return new LyricsModel(track, '', LyricsSourceType.embedded, fileMetadata.lyrics);
    }
}
