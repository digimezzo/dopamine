export abstract class BaseFileService {
    public abstract hasPlayableFilesAsParameters(): boolean;
    public abstract enqueueParameterFilesAsync(): Promise<void>;
}
