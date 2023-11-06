import { IFileMetadata } from './i-file-metadata';

export abstract class FileMetadataFactoryBase {
    public abstract createAsync(path: string): Promise<IFileMetadata>;
}
