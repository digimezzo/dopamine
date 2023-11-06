export abstract class IpcProxyBase {
    public abstract sendToMainProcess(channel: string, arg: unknown): void;
}
