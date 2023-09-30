export class PromiseUtils {
    public static noAwait<T>(promises: Promise<T>): void {
        promises.catch(() => {
            // Do nothing
        });
    }
}
