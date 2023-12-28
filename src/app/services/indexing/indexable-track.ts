import { Track } from '../../data/entities/track';
import { IndexablePath } from './indexable-path';
export class IndexableTrack extends Track {
    public dateModifiedTicks: number;
    public folderId: number;

    public constructor(public indexablePath: IndexablePath) {
        super(indexablePath.path);

        this.dateModifiedTicks = indexablePath.dateModifiedTicks;
        this.folderId = indexablePath.folderId;
    }
}
