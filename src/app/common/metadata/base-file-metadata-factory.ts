import { IFileMetadata } from './i-file-metadata';

export abstract class BaseFileMetadataFactory {
    public abstract createAsync(path: string): Promise<IFileMetadata>;
}
