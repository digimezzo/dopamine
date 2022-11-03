import RiffList from "./riffList";
import {ByteVector, StringType} from "../byteVector";
import {Tag} from "../tag";
import {Guards} from "../utils";

/**
 * Abstract class that provides support for reading/writing tags in the RIFF list format.
 */
export default abstract class RiffListTag extends Tag {
    // NOTE: Although it would totally make sense for this class to extend RiffList, we can't do
    //    that because multiple inheritance doesn't exist.

    private readonly _list: RiffList;
    private _stringType: StringType = StringType.UTF8;

    // #region Constructors

    protected constructor(list: RiffList) {
        super();
        this._list = list;
    }

    // #endregion

    // #region Properties

    /** @inheritDoc */
    public get isEmpty(): boolean { return this._list.valueCount === 0; }

    /**
     * Gets the {@link RiffList} that backs the data for this tag.
     * @remarks Tags based on RiffLists are only supposed to support certain fields. Modify at your
     *     own risk.
     */
    public get list(): RiffList { return this._list; }

    /** @inheritDoc */
    public get sizeOnDisk(): number { return this._list.originalTotalSize; }

    /**
     * Gets the type of string used for parsing and rendering the contents of this tag.
     */
    public get stringType(): StringType { return this._stringType; }
    /**
     * Sets the type of string used for parsing and rendering the contents of this tag.
     * @remarks The value must be `StringType.Latin1` or `StringType.UTF8`.
     */
    public set stringType(value: StringType) {
        // @TODO: Add a guard here?
        this._stringType = value;
    }

    // #endregion

    // #region Methods

    /** @inheritDoc */
    public clear(): void {
        this._list.clear();
    }

    /**
     * Gets the values for a specified item in the current instance.
     * @param id ID of the item of which to get the values
     */
    public getValues(id: string): ByteVector[] {
        return this._list.getValues(id);
    }

    /**
     * Gets the values for a specified item in the current instance as strings.
     * @param id ID of the item of which to get the values
     */
    public getValuesAsStrings(id: string): string[] {
        const values = this.getValues(id);
        return values.map((value) => {
            return value
                ? value.toString(this._stringType)
                : "";
        });
    }

    /**
     * Gets the value for a specified item in the current instance as an unsigned integer.
     * @param id ID of the item for which to get the value
     */
    public getValueAsUint(id: string): number {
        for (const value of this.getValuesAsStrings(id)) {
            const numberValue = Number.parseInt(value, 10);
            if (!Number.isNaN(numberValue) && numberValue > 0) {
                return numberValue;
            }
        }

        return 0;
    }

    /**
     * Removes the item with the specified ID from the current instance.
     * @param id ID of the item to remove
     */
    public removeValue(id: string): void {
        this._list.setValues(id, undefined);
    }

    /**
     * Sets the value for a specified item in the current instance
     * @param id ID of the item to set
     * @param values Values to store in the specified item
     */
    public setValues(id: string, values: ByteVector[]): void {
        this._list.setValues(id, values);
    }

    /**
     * Sets the value for a specified item in the current instance using a list of strings.
     * @param id ID of the item to set
     * @param values Values to store in the specified item
     */
    public setValuesFromStrings(id: string, values: string[]): void {
        const byteValues = values ? values.map((v) => ByteVector.fromString(v, this._stringType)) : undefined;
        this._list.setValues(id, byteValues);
    }

    /**
     * Sets the value for a specified item in the current instance using an unsigned integer.
     * @param id ID of the item to set
     * @param value Value to store in the specified item, must be an unsigned 32-bit integer
     */
    public setValueFromUint(id: string, value: number): void {
        Guards.uint(value, "value");
        const byteValues = value ? [ByteVector.fromString(value.toString(10), StringType.Latin1)] : undefined;
        this._list.setValues(id, byteValues);
    }

    /**
     * Renders the current instance, including list header and padding bytes, ready to be written
     * to a file.
     */
    public render(): ByteVector {
        return this._list.render();
    }

    /**
     * Gets the first non-falsy string for the specified ID. If the item is not found, `undefined`
     * is returned.
     * @param id ID of the item to lookup in the list.
     * @protected
     */
    protected getFirstValueAsString(id: string): string | undefined {
        return this.getValuesAsStrings(id).find((v) => !!v) || undefined;
    }

    // #endregion

}
