export class CorruptFileError extends Error {
    public readonly isCorruptFileError: boolean = true;

    public constructor(msg?: string) {
        super(msg);
    }

    public static errorIs(e: unknown): boolean {
        return e.hasOwnProperty("isCorruptFileError");
    }
}

export class NotImplementedError extends Error {
    public readonly isNotImplementedError: boolean = true;

    public constructor(message?: string) {
        super(`Not implemented${message ? `: ${message}` : ""}`);
    }

    public static errorIs(e: unknown): boolean {
        return e.hasOwnProperty("isNotImplementedError");
    }
}

export class NotSupportedError extends Error {
    public readonly isNotSupportedError: boolean = true;

    public constructor(message?: string) {
        super(`Not supported${message ? `: ${message}` : ""}`);
    }

    public static errorIs(e: unknown): boolean {
        return e.hasOwnProperty("isNotSupportedError");
    }
}

export class UnsupportedFormatError extends Error {
    public readonly isNotSupportedError: boolean = true;

    public constructor(message?: string) {
        super(`Unsupported format${message ? `: ${message}` : ""}`);
    }

    public static errorIs(e: unknown): boolean {
        return e.hasOwnProperty("isUnsupportedFormatError");
    }
}
