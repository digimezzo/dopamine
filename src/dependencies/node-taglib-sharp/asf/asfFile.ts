import AsfTag from "./asfTag";
import HeaderObject from "./objects/headerObject";
import {File, FileAccessMode, ReadStyle} from "../file";
import {IFileAbstraction} from "../fileAbstraction";
import {Properties} from "../properties";
import {Tag, TagTypes} from "../tag";
import {NumberUtils} from "../utils";

/**
 * This class provides tagging and properties support for Microsoft's ASF files.
 */
export default class AsfFile extends File {
    private readonly _asfTag: AsfTag;
    private readonly _properties: Properties;

    public constructor(file: IFileAbstraction|string, propertiesStyle: ReadStyle) {
        super(file);

        this.mode = FileAccessMode.Read;
        try {
            const header = HeaderObject.fromFile(this, 0);
            if (header.hasContentDescriptors) {
                this.tagTypesOnDisk |= TagTypes.Asf;
            }

            this._asfTag = AsfTag.fromHeader(header);

            if (NumberUtils.hasFlag(propertiesStyle, ReadStyle.Average)) {
                this._properties = header.properties;
            }
        } finally {
            this.mode = FileAccessMode.Closed;
        }
    }

    /** @inheritDoc */
    public get properties(): Properties { return this._properties; }

    /** @inheritDoc */
    public get tag(): AsfTag { return this._asfTag; }

    // @TODO: Add access to the header object

    // #region Methods

    /** @inheritDoc */
    public getTag(type: TagTypes): Tag {
        return type === TagTypes.Asf ? this._asfTag : undefined;
    }

    /** @inheritDoc */
    public removeTags(types: TagTypes): void {
        if (NumberUtils.hasFlag(types, TagTypes.Asf)) {
            this._asfTag.clear();
        }
    }

    /** @inheritDoc */
    public save(): void {
        super.preSave();
        this.mode = FileAccessMode.Write;
        try {
            // Re-read the header
            const header = HeaderObject.fromFile(this, 0);

            if (!this._asfTag) {
                // This file doesn't have a tag, but clear it just to be safe
                header.removeContentDescriptor();
                this.tagTypesOnDisk &= ~TagTypes.Asf;
            } else {
                // This file does have a tag, set the objects we have to it
                this.tagTypesOnDisk |= TagTypes.Asf;
                header.addUniqueObject(this._asfTag.contentDescriptionObject);
                header.addUniqueObject(this._asfTag.extendedContentDescriptionObject);
                header.extension.addUniqueObject(this._asfTag.metadataLibraryObject);
            }

            // Write the updated header to the file
            const output = header.render();
            const diff = output.length - header.originalSize;
            super.insert(output, 0, header.originalSize + diff);
        } finally {
            this.mode = FileAccessMode.Closed;
        }
    }

    // #endregion
}

// /////////////////////////////////////////////////////////////////////////
// Register the file type
[
    "taglib/wma",
    "taglib/wmv",
    "taglib/asf",
    "audio/x-ms-wma",
    "audio/x-ms-asf",
    "video/x-ms-asf"
].forEach((mt) => File.addFileType(mt, AsfFile));
