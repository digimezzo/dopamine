/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class IpcProxyBase {
    public abstract sendToMainProcess(channel: string, arg: unknown): void;
}
