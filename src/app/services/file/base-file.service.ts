export abstract class BaseFileService {
    public abstract hasPlayableFilesAsParameters(): boolean;
    public abstract enqueueParameterFilesAsync(): Promise<void>;
    public abstract enqueueGivenParameterFilesAsync(parameters: string[]): Promise<void>;
}
