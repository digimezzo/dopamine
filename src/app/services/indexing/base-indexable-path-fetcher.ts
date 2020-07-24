import { IndexablePath } from './indexable-path';

export abstract class BaseIndexablePathFetcher {
    public abstract async getIndexablePathsForAllFoldersAsync(): Promise<IndexablePath[]>;
}
