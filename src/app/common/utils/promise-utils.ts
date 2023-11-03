export class PromiseUtils {
    public static noAwait<T>(promise: Promise<T>): void {
        promise.catch(() => {
            // Do nothing
        });
    }
}
