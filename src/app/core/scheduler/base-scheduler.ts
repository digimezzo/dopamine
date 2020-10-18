export abstract class BaseScheduler {
    public abstract sleepAsync(milliseconds: number): Promise<void>;
}
