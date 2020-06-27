export abstract class FolderServiceBase {
    public abstract addFolderAsync(path: string): Promise<void>;
}
