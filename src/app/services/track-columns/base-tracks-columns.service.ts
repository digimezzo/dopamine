import { TracksColumnsVisibility } from './track-columns-visibility';

export abstract class BaseTracksColumnsService {
    public abstract getTracksColumnsVisibility(): TracksColumnsVisibility;
    public abstract saveTracksColumnsVisibility(tracksColumnsVisibility: TracksColumnsVisibility): void;
}
