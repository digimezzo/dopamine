import RiffList from "./riffList";
import RiffListTag from "./riffListTag";
import {TagTypes} from "../tag";
import {Guards} from "../utils";

/**
 * Provides support for reading and writing MovieID tags.
 */
export default class MovieIdTag extends RiffListTag {
    public static readonly LIST_TYPE = "MID ";

    // #region Constructors

    private constructor(list: RiffList) {
        super(list);
    }

    /**
     * Constructs and initializes a new instance by reading the contents of a raw RIFF list stored
     * a file.
     * @param list List that contains the contents of the tag
     */
    public static fromList(list: RiffList): MovieIdTag {
        Guards.truthy(list, "list");
        return new MovieIdTag(list);
    }

    /**
     * Constructs and initializes a new, empty instance.
     */
    public static fromEmpty(): MovieIdTag {
        return new MovieIdTag(RiffList.fromEmpty(MovieIdTag.LIST_TYPE));
    }

    // #endregion

    // #region Properties

    /** @inheritDoc */
    public get tagTypes(): TagTypes { return TagTypes.MovieId; }

    /**
     * @inheritDoc
     * @remarks Implemented via the `TITL` item.
     */
    public get title(): string { return this.getFirstValueAsString("TITL"); }
    /**
     * @inheritDoc
     * @remarks Implemented via the `TITL` item.
     */
    public set title(value: string) { this.setValuesFromStrings("TITL", value ? [value] : undefined ); }

    /**
     * @inheritDoc
     * @remarks Implemented via the `IART` item.
     */
    public get performers(): string[] { return this.getValuesAsStrings("IART"); }
    /**
     * @inheritDoc
     * @remarks Implemented via the `IART` item.
     */
    public set performers(value: string[]) { this.setValuesFromStrings("IART", value || []); }

    /**
     * @inheritDoc
     * @remarks Implemented via the `COMM` item.
     */
    public get comment(): string { return this.getFirstValueAsString("COMM"); }
    /**
     * @inheritDoc
     * @remarks Implemented via the `COMM` item.
     */
    public set comment(value: string) { this.setValuesFromStrings("COMM", value ? [value] : undefined); }

    /**
     * @inheritDoc
     * @remarks Implemented via the `GENR` item.
     */
    public get genres(): string[] { return this.getValuesAsStrings("GENR"); }
    /**
     * @inheritDoc
     * @remarks Implemented via the `GENR` item.
     */
    public set genres(value: string[]) { this.setValuesFromStrings("GENR", value || []); }

    /**
     * @inheritDoc
     * @remarks Implemented via the `PRT1` item.
     */
    public get track(): number { return this.getValueAsUint("PRT1"); }
    /**
     * @inheritDoc
     * @remarks Implemented via the `PRT1` item.
     */
    public set track(value: number) { this.setValueFromUint("PRT1", value); }

    /**
     * @inheritDoc
     * @remarks Implemented via the `PRT2` item.
     */
    public get trackCount(): number { return this.getValueAsUint("PRT2"); }
    /**
     * @inheritDoc
     * @remarks Implemented via the `PRT2` item.
     */
    public set trackCount(value: number) { this.setValueFromUint("PRT2", value); }

    // #endregion
}
