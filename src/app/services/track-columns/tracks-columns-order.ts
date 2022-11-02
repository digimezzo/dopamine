import { TracksColumnsOrderColumn } from './tracks-columns-order-column';
import { TracksColumnsOrderDirection } from './tracks-columns-order-direction';

export class TracksColumnsOrder {
    public constructor(
        public tracksColumnsOrderColumn: TracksColumnsOrderColumn,
        public tracksColumnsOrderDirection: TracksColumnsOrderDirection
    ) {}
}
