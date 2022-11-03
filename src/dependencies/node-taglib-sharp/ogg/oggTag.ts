import itiriri from "itiriri";

import CombinedTag from "../combinedTag";
import OggFileSettings from "./oggFileSettings";
import XiphComment from "../xiph/xiphComment";
import {Tag, TagTypes} from "../tag";
import {Guards} from "../utils";

/**
 * This class combines a collection of {@link XiphComment} objects so that tagging properties can
 * be read from each but are only set to the first comment of the file.
 */
export default class OggTag extends CombinedTag {
    private _comments: Map<number, XiphComment>;

    /**
     * Constructs and initializes a new instance with no contents.
     */
    public constructor(comments: Map<number, XiphComment>) {
        super(TagTypes.None, OggFileSettings.writeToAllComments, Array.from(comments.values()));

        this._comments = comments;
    }

    // #region Methods

    /**
     * Gets the list of comments in the current instance, in the order they were added.
     * @remarks Modifying this array makes no changes to the file. Use {@link setComment}.
     */
    public get comments(): XiphComment[] { return Array.from(this._comments.values()); }

    /**
     * Gets the list of stream serial numbers that have comments associated with them.
     * @remarks Modifying this array makes no changes to the file. Use {@link setComment}.
     */
    public get serialNumbers(): number[] { return Array.from(this._comments.keys()); }

    /**
     * Retrieves a Xiph comment for a given stream.
     * @param streamSerialNumber Serial number of the stream that contains the desired comment.
     *     Must be a positive 32-bit integer.
     * @returns XiphComment Xiph comment of the provided stream is returned if it exists, otherwise
     *     `undefined` is returned.
     */
    public getComment(streamSerialNumber: number): XiphComment {
        Guards.uint(streamSerialNumber, "streamSerialNumber");
        return this._comments.get(streamSerialNumber);
    }

    /**
     * Stores or removes a Xiph comment in a given stream.
     * @param streamSerialNumber Serial number of the stream in which to store the comment. Must be
     *     a positive 32-bit integer
     * @param comment Xiph comment to store in the stream. Use `undefined` to clear the comment
     *     from the stream
     * @remarks As per Ogg spec, each stream must have a Xiph comment header. Therefore, comments
     *     cannot be set to a falsy value.
     */
    public setComment(streamSerialNumber: number, comment: XiphComment): void {
        Guards.uint(streamSerialNumber, "streamSerialNumber");
        Guards.truthy(comment, "comment");

        const oldComment = this._comments.get(streamSerialNumber);
        if (!oldComment) {
            throw new Error("Argument out of range: new tags cannot be added to Ogg files.");
        }

        super.replaceTag(oldComment, comment);
        this._comments.set(streamSerialNumber, comment);
    }

    // #endregion

    // #region Tag Implementation

    /** @inheritDoc */
    // TODO: This value is never updated after a save!!
    public get sizeOnDisk(): number {
        return itiriri(this._comments.values()).reduce((accum, c) => accum + c.sizeOnDisk, 0);
    }

    /**
     * @inheritDoc
     * @remarks Tags cannot be added or removed from Ogg files. This will always throw.
     */
    public createTag(): Tag {
        throw new Error("Invalid operation: tags cannot be added or removed from Ogg files.");
    }

    /**
     * @inheritDoc
     * @remarks Tags cannot be added or removed from Ogg files. This will do nothing.
     */
    public removeTags(): void {
        /* no-op */
    }

    // #endregion
}
