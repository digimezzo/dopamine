import { readMetadata, updateFile } from '../../../../main/metadata/music-metadata-adapter';
import { MusicFileMetadata } from './music-file-metadata';

jest.mock('../../../../main/metadata/music-metadata-adapter', () => ({ updateFile: jest.fn(), readMetadata: jest.fn() }));

describe('editor metadata writes', () => {
    beforeEach(() => jest.resetAllMocks());

    it.each([
        'track.mp3',
        'track.FLAC',
        'track.ogg',
        'track.OGG',
        'track.opus',
        'track.OPUS',
        'track.mp4',
        'track.MP4',
        'track.m4a',
        'track.M4A',
        'track.wav',
        'track.WAV',
    ])('awaits %s writes and preserves lyrics and ratings', async (path) => {
        let finish!: () => void;
        (updateFile as jest.Mock).mockReturnValue(
            new Promise<void>((resolve) => {
                finish = resolve;
            }),
        );
        const metadata = new MusicFileMetadata(path);
        metadata.title = '中文 title';
        metadata.artists = ['One', 'Two'];
        metadata.lyrics = 'Existing lyrics';
        let saved = false;
        const saving = metadata.save().then(() => {
            saved = true;
        });
        expect(saved).toBe(false);
        expect(updateFile).toHaveBeenCalledWith(
            path,
            expect.objectContaining({ title: '中文 title', artists: ['One', 'Two'], picture: null }),
            undefined,
        );
        const patch = (updateFile as jest.Mock).mock.calls[0][1];
        expect(patch).not.toHaveProperty('lyrics');
        expect(patch).not.toHaveProperty('rating');
        finish();
        await saving;
        expect(saved).toBe(true);
    });

    it.each(['track.flac', 'track.mp4', 'track.m4a'])('propagates %s write failures', async (path) => {
        (updateFile as jest.Mock).mockRejectedValue(new Error('disk full'));
        await expect(new MusicFileMetadata(path).save()).rejects.toThrow('disk full');
    });
    it.each(Array.from({ length: 11 }, (_, rating) => rating))(
        'passes UI rating %s without rescaling and resets dirty state after success',
        async (rating) => {
            const metadata = new MusicFileMetadata('track.mp3');
            metadata.rating = rating;
            await metadata.save();
            expect(updateFile).toHaveBeenLastCalledWith('track.mp3', expect.any(Object), rating);
            await metadata.save();
            expect(updateFile).toHaveBeenLastCalledWith('track.mp3', expect.any(Object), undefined);
        },
    );

    it('retains a changed rating after a rejected save', async () => {
        const metadata = new MusicFileMetadata('track.wav');
        metadata.rating = 7;
        (updateFile as jest.Mock).mockRejectedValueOnce(new Error('failure'));
        await expect(metadata.save()).rejects.toThrow('failure');
        await metadata.save();
        expect(updateFile).toHaveBeenLastCalledWith('track.wav', expect.any(Object), 7);
    });

    it('loads the common adapter without marking the rating dirty', async () => {
        (readMetadata as jest.Mock).mockResolvedValue({ title: 'Loaded', artists: ['One', 'Two'], rating: 9 });
        const metadata = new MusicFileMetadata('track.wav');
        await metadata.loadAsync();
        expect(metadata.artists).toEqual(['One', 'Two']);
        expect(metadata.rating).toBe(9);
        await metadata.save();
        expect(updateFile).toHaveBeenLastCalledWith('track.wav', expect.any(Object), undefined);
    });
});
