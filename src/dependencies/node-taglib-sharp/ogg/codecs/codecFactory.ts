import IOggCodec from "./iOggCodec";
import Opus from "./opus";
import Theora from "./theora";
import Vorbis from "./vorbis";
import {ByteVector} from "../../byteVector";
import {UnsupportedFormatError} from "../../errors";
import {Guards} from "../../utils";

export type CodecProvider = (firstPacket: ByteVector) => IOggCodec | undefined;

/**
 * Factory for creating codecs from the first packet of the Ogg bitstream.
 * @remarks By default, only codecs provided by the library will be matched. However, custom codec
 *     support can be added by using {@see addCodecProvider}.
 */
export default class CodecFactory {
    private static _customCodecProviders: CodecProvider[] = [];

    /**
     * Adds a custom codec provider to try before using standard codec creation methods.
     * Codec providers are used before standard methods so custom checking can be used and new
     * formats can be added. They are executed in reverse order in which they are added.
     * @param provider Codec provider function
     *     * firstPacket: ByteVector First packet of the bitstream
     *     * returns IOggCodec if method was able to match the packet, falsy otherwise
     */
    public static addCodecProvider(provider: CodecProvider): void {
        Guards.truthy(provider, "provider");
        CodecFactory._customCodecProviders.push(provider);
    }

    /**
     * Clears the custom providers from the factory.
     */
    public static clearCustomProviders(): void {
        CodecFactory._customCodecProviders = [];
    }

    /**
     * Determines the correc codec to use for a stream header packet.
     * @param packet First packet of an Ogg logical bitstream.
     */
    public static getCodec(packet: ByteVector): IOggCodec {
        Guards.truthy(packet, "packet");

        // Check custom providers first
        let codec: IOggCodec;
        for (const provider of CodecFactory._customCodecProviders) {
            codec = provider(packet);
        }
        if (codec) {
            return codec;
        }

        // Try the known codecs
        if (Vorbis.isHeaderPacket(packet)) {
            // Vorbis
            codec = new Vorbis(packet);
        } else if (Theora.isHeaderPacket(packet)) {
            // Theora
            codec = new Theora(packet);
        } else if (Opus.isHeaderPacket(packet)) {
            // Opus
            codec = new Opus(packet);
        } else {
            throw new UnsupportedFormatError("Unknown Ogg codec");
        }

        return codec;
    }
}
