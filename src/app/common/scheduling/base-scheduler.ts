export abstract class BaseScheduler {
    public abstract sleepAsync(milliseconds: number): Promise<void>;
    public abstract sleepUntilConditionIsTrueAsync(milliseconds: number, untilMilliseconds: number, condition: boolean): Promise<void>;
}
