/* SystemJS module definition */
declare const nodeModule: NodeModule;
interface NodeModule {
    id: string;
}

interface Window {
    process: unknown;
    require: unknown;
}

declare module '*.wasm' {
    const dataUrl: string;
    export default dataUrl;
}
