export interface IDisposable {
    dispose(): void;
}

export interface ILazy {
    isLoaded: boolean;
    load(): void;
}
