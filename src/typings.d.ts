/* SystemJS module definition */
declare const nodeModule: NodeModule;
interface NodeModule {
    id: string;
}

interface Window {
    process: unknown;
    require: unknown;
}
