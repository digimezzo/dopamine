/**
 * Indicates the MPEG audio channel mode of a file or stream.
 */
export enum ChannelMode {
    /** Stereo */
    Stereo = 0,

    /** Joint Stereo */
    JointStereo = 1,

    /** Dual Channel Mono */
    DualChannel = 2,

    /** Single Channel Mono */
    SingleChannel= 3
}

/**
 * Indicates the MPEG version of a file or stream.
 */
export enum MpegVersion {
    /** Unknown version */
    Unknown = -1,

    /** MPEG-1 */
    Version1 = 0,

    /** MPEG-2 */
    Version2 = 1,

    /** MPEG-2.5 */
    Version25 = 2
}
