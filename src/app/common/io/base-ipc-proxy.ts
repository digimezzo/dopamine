export abstract class BaseIpcProxy {
    public abstract sendToMainProcess(channel: string, arg: any): void;
}
