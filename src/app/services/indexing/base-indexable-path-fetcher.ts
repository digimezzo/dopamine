import { IndexablePath } from './indexable-path';

export abstract class BaseIndexablePathFetcher {
    public abstract getIndexablePathsForAllFoldersAsync(): Promise<IndexablePath[]>;
}
