import { IMock, Mock } from 'typemoq';
import { Logger } from '../../app/core/logger';
import { TrackRepository } from '../../app/data/repositories/track-repository';
import { TrackFiller } from '../../app/services/indexing/track-filler';
import { TrackUpdater } from '../../app/services/indexing/track-updater';
import { TrackVerifier } from '../../app/services/indexing/track-verifier';
import { BaseSnackBarService } from '../../app/services/snack-bar/base-snack-bar.service';

export class TrackUpdaterMocker {
    constructor() {
        this.trackUpdater = new TrackUpdater(
            this.trackRepositoryMock.object,
            this.trackFillerMock.object,
            this.trackVerifierMock.object,
            this.snackBarServiceMock.object,
            this.loggerMock.object
        );
    }

    public trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
    public trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
    public trackVerifierMock: IMock<TrackVerifier> = Mock.ofType<TrackVerifier>();
    public snackBarServiceMock: IMock<BaseSnackBarService> = Mock.ofType<BaseSnackBarService>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public trackUpdater: TrackUpdater;
}
