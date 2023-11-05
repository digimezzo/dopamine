export abstract class FileServiceBase {
    public abstract hasPlayableFilesAsParameters(): boolean;
    public abstract enqueueParameterFilesAsync(): Promise<void>;
}
