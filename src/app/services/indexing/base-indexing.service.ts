export abstract class BaseIndexingService {
    public abstract async startIndexingAsync(): Promise<void>;
}
