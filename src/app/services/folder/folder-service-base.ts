export abstract class FolderServiceBase {
    public abstract addNewFolderAsync(path: string): Promise<void>;
}
