import { IMock, Mock } from 'typemoq';
import { DataDelimiter } from '../../app/data/data-delimiter';
import { MetadataPatcher } from '../../app/metadata/metadata-patcher';
import { TrackFieldCreator } from '../../app/services/indexing/track-field-creator';

export class TrackFieldCreatorMocker {
    constructor() {
        this.trackFieldCreator = new TrackFieldCreator(
            this.metadataPatcherMock.object,
            this.datadelimiterMock.object
        );
    }

    public metadataPatcherMock: IMock<MetadataPatcher> = Mock.ofType<MetadataPatcher>();
    public datadelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
    public trackFieldCreator: TrackFieldCreator;
}
