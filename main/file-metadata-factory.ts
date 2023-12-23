import { IFileMetadata } from '../src/app/common/metadata/i-file-metadata';
import { TagLibFileMetadata } from '../src/app/common/metadata/tag-lib-file-metadata';

export class FileMetadataFactory {
    public static async createAsync(path: string): Promise<IFileMetadata> {
        const fileMetadata: IFileMetadata = new TagLibFileMetadata(path);
        await fileMetadata.loadAsync();

        return fileMetadata;
    }
}
