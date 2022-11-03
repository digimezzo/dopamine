import * as Path from "path";
import {ByteVector} from "./byteVector";

export class Guards {
    private static readonly MAX_LONG = BigInt("9223372036854775807");
    private static readonly MAX_ULONG = BigInt("18446744073709551615");
    private static readonly MIN_LONG = BigInt("-9223372036854775808");

    public static all<TElement>(value: TElement[], guard: (val: TElement, name: string) => void, name: string): void {
        for (const element of value) {
            guard(element, `All elements in ${name}`);
        }
    }

    public static betweenExclusive(value: number, minValue: number, maxValue: number, name: string): void {
        if (value <= minValue || value >= maxValue) {
            throw new Error(`Argument out of range: ${name} must satisfy ${maxValue} <= ${name} <= ${minValue}`);
        }
    }

    public static betweenInclusive(value: number, minValue: number, maxValue: number, name: string): void {
        if (value < minValue || value > maxValue) {
            throw new Error(`Argument out of range: ${name} must satisfy ${maxValue} < ${name} < ${minValue}`);
        }
    }

    public static byte(value: number, name: string): void {
        if (!Number.isSafeInteger(value) || value < 0 || value > 0xFF) {
            throw new Error(`Argument out of range: ${name} must be a safe, positive, 8-bit integer`);
        }
    }

    public static greaterThanInclusive(value: number, lowerBound: number, name: string): void {
        if (value < lowerBound) {
            throw new Error(`Argument out of range: ${name} must greater than ${lowerBound}`);
        }
    }

    public static int(value: number, name: string): void {
        if (!Number.isInteger(value) || value < -2147483648 || value > 2147483647) {
            throw new Error(`Argument out of range: ${name} must be a 32-bit integer`);
        }
    }

    public static lessThanInclusive(value: number, upperBound: number, name: string): void {
        if (value > upperBound) {
            throw new Error(`Argument out of range: ${name} must be less than ${upperBound}`);
        }
    }

    public static long(value: bigint, name: string): void {
        if (value > Guards.MAX_LONG || value < Guards.MIN_LONG) {
            throw new Error(`Argument out of range: ${name} must be a 64-bit integer`);
        }
    }

    public static notNullOrUndefined(value: unknown, name: string): void {
        if (value === undefined || value === null) {
            throw new Error(`Argument null: ${name} was not provided`);
        }
    }

    public static optionalByte(value: number | undefined, name: string): void {
        if (value === undefined) {
            return;
        }
        Guards.byte(value, name);
    }

    /**
     * Throws if the provided value is not a safe, integer. Use this method instead of
     * {@see Guards.int()} if validating an argument for use in file manipulation.
     * @param value Value to validate
     * @param name Name of the parameter in calling function
     */
    public static safeInt(value: number, name: string): void {
        if (!Number.isSafeInteger(value)) {
            throw new Error(`Argument out of range: ${name} must be a safe JS integer`);
        }
    }

    /**
     * Throws if the provided value is not a safe, positive integer. Use this method instead of
     * {@see Guards.uint()} if validating an argument for use in file manipulation.
     * @param value Value to validate
     * @param name Name of the parameter in calling function
     */
    public static safeUint(value: number, name: string): void {
        if (!Number.isSafeInteger(value) || value < 0) {
            throw new Error(`Argument out of range ${name} must be a safe, positive JS integer`);
        }
    }

    public static short(value: number, name: string): void {
        if (!Number.isSafeInteger(value) || value > 32767 || value < -32768) {
            throw new Error(`Argument out of range: ${name} must be a 16-bit integer`);
        }
    }

    public static truthy(value: object|string, name: string): void {
        if (!value) {
            throw new Error(`Argument null: ${name} was not provided`);
        }
    }

    public static uint(value: number, name: string): void {
        if (!Number.isSafeInteger(value) || value > 4294967295 || value < 0) {
            throw new Error(`Argument out of range: ${name} must be a positive, 32-bit integer`);
        }
    }

    public static ushort(value: number, name: string): void {
        if (!Number.isSafeInteger(value) || value > 65535 || value < 0) {
            throw new Error(`Argument out of range: ${name} must be a positive, 16-bit integer`);
        }
    }

    public static ulong(value: bigint, name: string): void {
        if (value > this.MAX_ULONG || value < 0) {
            throw new Error(`Argument out of range: ${name} must be a positive, 64-bit integer`);
        }
    }
}

export class StringComparison {
    public static caseInsensitive(a: string, b: string): boolean {
        Guards.notNullOrUndefined(a, "a");
        Guards.notNullOrUndefined(b, "b");
        return a.toUpperCase() === b.toUpperCase();
    }

    public static caseSensitive(a: string, b: string): boolean {
        return a === b;
    }
}

export class FileUtils {
    public static getExtension(name: string): string {
        let ext = Path.extname(name);
        if (!ext) {
            ext = name.startsWith(".") ? name.substring(1) : name;
        } else {
            ext = ext.substring(1);
        }

        return ext.toLowerCase();
    }
}

export class ArrayUtils {
    public static remove<T>(array: T[], callbackFn: (e: T, i: number) => boolean): void {
        let i = this.length;
        while (i--) {
            if (callbackFn(array[i], i)) {
                array.splice(i, 1);
            }
        }
    }
}

export class NumberUtils {
    public static readonly BIG_ZERO = BigInt(0);
    public static readonly BIG_ONE = BigInt(1);
    public static readonly BIG_TWO = BigInt(2);
    public static readonly TICKS_PER_MILLISECOND_BIG = BigInt(10000);
    public static readonly TICKS_PER_MILLISECOND_NUM = 10000;

    public static bigPow(x: bigint, y: number): bigint {
        Guards.uint(y, "y");

        let result = BigInt(1);
        for (let i = 0; i < y; i++) {
            result *= x;
        }

        return result;
    }

    public static hasFlag(haystack: number, needle: number, strict: boolean = false): boolean {
        return strict
            ? (haystack & needle) === needle
            : (haystack & needle) !== 0;
    }

    /**
     * Performs the same operation as ldexp does in C/C++
     * @param x Number to be multiplied by 2^y
     * @param y Power to raise 2 to
     * @returns Number x * 2^y
     */
    public static ldexp(x: number, y: number): number {
        return x * Math.pow(2, y);
    }

    /**
     * Converts .NET DateTime ticks (100 nanosecond units) into milliseconds
     * @param ticks 100 nanosecond ticks to convert
     */
    public static ticksToMilli(ticks: bigint|number): number {
        // Ticks are 100 nanosecond units
        return typeof(ticks) === "number"
            ? ticks / NumberUtils.TICKS_PER_MILLISECOND_NUM
            : Number(ticks / NumberUtils.TICKS_PER_MILLISECOND_BIG);
    }

    /**
     * Provides way to do unsigned bitwise AND without all the mess of parenthesis.
     * @param x Left operand
     * @param y Right operand
     * @returns Number (x & y) >>> 0
     */
    public static uintAnd(x: number, y: number): number {
        return (x & y) >>> 0;
    }

    /**
     * Provides way to do unsigned bitwise OR without all the mess of parenthesis.
     * @param numbers Operands to bitwise or together
     * @returns Number (x | y | ...) >>> 0
     */
    public static uintOr(... numbers: number[]): number {
        return numbers.reduce((acc, cur) => (acc | cur) >>> 0, 0);
    }

    /**
     * Provides way to do unsigned bitwise XOR without all the mess of parenthesis.
     * @param x Left operand
     * @param y Right operant
     * @returns Number (x ^ y) >>> 0
     */
    public static uintXor(x: number, y: number): number {
        return (x ^ y) >>> 0;
    }

    /**
     * Provides way to do unsigned bitshift left without all the mess of parenthesis.
     * @param x Number
     * @param y Bits to shift to the left
     * @returns Number (x << y) >>> 0;
     */
    public static uintLShift(x: number, y: number): number {
        return (x << y) >>> 0;
    }

    /**
     * Provides unified way to do unsigned right bitshift.
     * @param x Number
     * @param y Bits to shift to the right
     */
    public static uintRShift(x: number, y: number): number {
        return x >>> y;
    }

    /**
     * Converts IEEE 80-bit floating point numbers (SANE "extended" type) to double precision
     * floating point number.
     * @source http://www33146ue.sakura.ne.jp/staff/iz/formats/ieee.c
     */
    public static convertFromIeeeExtended(bytes: ByteVector): number {
        let f: number;

        let exponent = NumberUtils.uintLShift(NumberUtils.uintAnd(bytes.get(0), 0x7F), 8);
        exponent = NumberUtils.uintOr(exponent, bytes.get(1));

        let hiMantissa = NumberUtils.uintLShift(bytes.get(2), 24);
        hiMantissa = NumberUtils.uintOr(hiMantissa, NumberUtils.uintLShift(bytes.get(3), 16));
        hiMantissa = NumberUtils.uintOr(hiMantissa, NumberUtils.uintLShift(bytes.get(4), 8));
        hiMantissa = NumberUtils.uintOr(hiMantissa, bytes.get(5));
        let loMantissa = NumberUtils.uintLShift(bytes.get(6), 24);
        loMantissa = NumberUtils.uintOr(loMantissa, NumberUtils.uintLShift(bytes.get(7), 16));
        loMantissa = NumberUtils.uintOr(loMantissa, NumberUtils.uintLShift(bytes.get(8), 8));
        loMantissa = NumberUtils.uintOr(loMantissa, bytes.get(9));

        if (exponent === 0 && hiMantissa === 0 && loMantissa === 0) {
            return 0;
        }

        if (exponent === 0x7FFF) {
            f = Number.POSITIVE_INFINITY;
        } else {
            exponent -= 16383;
            f = NumberUtils.ldexp(hiMantissa, exponent -= 31);
            f += NumberUtils.ldexp(loMantissa, exponent - 32);
        }

        if ((bytes.get(0) & 0x80) !== 0) {
            return -f;
        } else {
            return f;
        }
    }
}

export class StringUtils {
    public static trimStart(toTrim: string, chars: string): string {
        while (toTrim.length > 0 && chars.indexOf(toTrim[0]) > -1) {
            toTrim = toTrim.substring(0);
        }
        return toTrim;
    }

    public static findLastByteFromRight(haystack: string, needle: number): number {
        let length = haystack.length;
        while (length > 0 && haystack.charCodeAt(length - 1) === needle) {
            length--;
        }
        return length;
    }
}
