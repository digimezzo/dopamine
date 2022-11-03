// BASE EXPORTS ////////////////////////////////////////////////////////////
// Base/Support classes
export {ByteVector, StringType} from "./byteVector";
export {CorruptFileError, NotImplementedError} from "./errors";
export {File, FileAccessMode, FileTypeConstructor, FileTypeResolver, ReadStyle} from "./file";
export {LocalFileAbstraction} from "./fileAbstraction";

// Base Tag Classes
export {default as CombinedTag} from "./combinedTag";
export {default as Genres} from "./genres";
export {IPicture, Picture, PictureLazy, PictureType} from "./picture";
export {ICodec, IAudioCodec, ILosslessAudioCodec, IVideoCodec, IPhotoCodec, MediaTypes, Properties} from "./properties";
export {Tag, TagTypes} from "./tag";

// AAC /////////////////////////////////////////////////////////////////////
export {default as AacFile} from "./aac/aacFile";
export {default as AacFileSettings} from "./aac/aacFileSettings";

// AIFF ////////////////////////////////////////////////////////////////////
export {default as AiffFile} from "./aiff/aiffFile";

// APE /////////////////////////////////////////////////////////////////////
export {default as ApeFile} from "./ape/apeFile";
export {default as ApeFileSettings} from "./ape/apeFileSettings";
export {default as ApeTag} from "./ape/apeTag";

// ASF /////////////////////////////////////////////////////////////////////
export {default as AsfFile} from "./asf/asfFile";
export {default as AsfTag} from "./asf/asfTag";

// Objects
export {default as AsfContentDescriptionObject} from "./asf/objects/contentDescriptionObject";
export {DataType as AsfObjectDataType} from "./asf/objects/descriptorBase";
export {
    ContentDescriptor as AsfContentDescriptor,
    ExtendedContentDescriptionObject as AsfExtendedContentDescriptionObject
} from "./asf/objects/extendedContentDescriptionObject";
export { default as AsfFilePropertiesObject } from "./asf/objects/filePropertiesObject";
export { default as AsfHeaderExtensionObject } from "./asf/objects/headerExtensionObject";
export { default as AsfHeaderObject } from "./asf/objects/headerObject";
export {
    MetadataDescriptor as AsfMetadataDescriptor,
    MetadataLibraryObject as AsfMetadataLibraryObject
} from "./asf/objects/metadataLibraryObject";
export { default as AsfPaddingObject } from "./asf/objects/paddingObject";
export { default as AsfStreamPropertiesObject } from "./asf/objects/streamPropertiesObject";
export { default as AsfUnknownObject } from "./asf/objects/unknownObject";

// FLAC ////////////////////////////////////////////////////////////////////
export {FlacBlock} from "./flac/flacBlock";
export {default as FlacFile} from "./flac/flacFile";
export {default as FlacFileSettings} from "./flac/flacFileSettings";
export {default as FlacTag} from "./flac/flacTag";

// ID3v1 ///////////////////////////////////////////////////////////////////
export {default as Id3v1Tag} from "./id3v1/id3v1Tag";

// ID3v2 ///////////////////////////////////////////////////////////////////
export {default as Id3v2ExtendedHeader} from "./id3v2/id3v2ExtendedHeader";
export {default as Id3v2FrameFactory} from "./id3v2/frames/frameFactory";
export {
    FrameIdentifier as Id3v2FrameIdentifier,
    FrameIdentifiers as Id3v2FrameIdentifiers,
} from "./id3v2/frameIdentifiers";
export {default as Id3v2Settings} from "./id3v2/id3v2Settings";
export {default as Id3v2Tag} from "./id3v2/id3v2Tag";
export {default as Id3v2TagFooter} from "./id3v2/id3v2TagFooter";
export {Id3v2TagHeader, Id3v2TagHeaderFlags} from "./id3v2/id3v2TagHeader";
export {
    SynchronizedTextType as Id3v2SynchronizedTextType,
    TimestampFormat as Id3v2TimestampFormat,
    EventType as Id3v2EventType
} from "./id3v2/utilTypes";

// Frames
export {default as Id3v2AttachmentFrame} from "./id3v2/frames/attachmentFrame";
export {default as Id3v2CommentsFrame} from "./id3v2/frames/commentsFrame";
export {
    EventTimeCode as Id3v2EventTimeCode,
    EventTimeCodeFrame as Id3v2EventTimeCodeFrame
} from "./id3v2/frames/eventTimeCodeFrame";
export {
    Frame as Id3v2Frame,
    FrameClassType as Id3v2FrameClassType
} from "./id3v2/frames/frame";
export {Id3v2FrameFlags, Id3v2FrameHeader} from "./id3v2/frames/frameHeader";
export {default as Id3v2MusicCdIdentifierFrame} from "./id3v2/frames/musicCdIdentifierFrame";
export {default as Id3v2PlayCountFrame} from "./id3v2/frames/playCountFrame";
export {default as Id3v2PopularimeterFrame} from "./id3v2/frames/popularimeterFrame";
export {default as Id3v2PrivateFrame} from "./id3v2/frames/privateFrame";
export {
    ChannelData as Id3v2RelativeVolumeFrameChannelData,
    ChannelType as Id3v2RelativeVolumeFrameChannelType,
    RelativeVolumeFrame as Id3v2RelativeVolumeFrame
} from "./id3v2/frames/relativeVolumeFrame";
export {
    SynchronizedLyricsFrame as Id3v2Synchronized,
    SynchronizedText as Id3v2SynchronizedLyricsFrame
} from "./id3v2/frames/synchronizedLyricsFrame";
export {default as Id3v2TermsOfUseFrame} from "./id3v2/frames/termsOfUseFrame";
export {
    TextInformationFrame as Id3v2TextInformationFrame,
    UserTextInformationFrame as Id3v2UserTextInformationFrame
} from "./id3v2/frames/textInformationFrame";
export {default as Id3v2UniqueFileIdentifierFrame} from "./id3v2/frames/uniqueFileIdentifierFrame";
export {default as Id3v2UnknownFrame} from "./id3v2/frames/unknownFrame";
export {default as Id3v2UnsynchronizedFrame} from "./id3v2/frames/unsynchronizedLyricsFrame";
export {
    UrlLinkFrame as Id3v2UrlLinkFrame,
    UserUrlLinkFrame as Id3v2UserUrlLinkFrame
} from "./id3v2/frames/urlLinkFrame";

// MPEG1/2 /////////////////////////////////////////////////////////////////
export {default as MpegAudioFile} from "./mpeg/mpegAudioFile";
export {default as MpegAudioHeader} from "./mpeg/mpegAudioHeader";
export {
    ChannelMode as MpegAudioChannelMode,
    MpegVersion as MpegVersion
} from "./mpeg/mpegEnums";
export {default as MpegContainerFile} from "./mpeg/mpegContainerFile";
export {default as MpegVbriHeader} from "./mpeg/vbriHeader";
export {default as MpegVideoHeader} from "./mpeg/mpegVideoHeader";
export {default as MpegXingHeader} from "./mpeg/xingHeader";

// OGG /////////////////////////////////////////////////////////////////////
export {default as OggFile} from "./ogg/oggFile";
export {default as OggFileSettings} from "./ogg/oggFileSettings";
export {default as OggTag} from "./ogg/oggTag";

export {default as OggCodecFactory} from "./ogg/codecs/codecFactory";
export {default as OggOpusCodec} from "./ogg/codecs/opus";
export {default as OggTheoraCodec} from "./ogg/codecs/theora";
export {default as OggVorbisCodec} from "./ogg/codecs/vorbis";

// RIFF ////////////////////////////////////////////////////////////////////
export {default as RiffFile} from "./riff/riffFile";
export {
    AviStream,
    AviStreamType
} from "./riff/avi/aviStream";
export {default as DivxTag} from "./riff/divxTag";
export {default as InfoTag} from "./riff/infoTag";
export {default as MovieIdTag} from "./riff/movieIdTag";
export {default as RiffBitmapInfoHeader} from "./riff/riffBitmapInfoHeader";
export {default as RiffList} from "./riff/riffList";
export {default as RiffListTag} from "./riff/riffListTag";
export {default as RiffWaveFormatEx} from "./riff/riffWaveFormatEx";

// XIPH ////////////////////////////////////////////////////////////////////
export {default as XiphComment} from "./xiph/xiphComment";
export {default as XiphPicture} from "./xiph/xiphPicture";
