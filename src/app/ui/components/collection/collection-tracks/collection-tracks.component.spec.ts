import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { CollectionTracksComponent } from './collection-tracks.component';
import { SearchServiceBase } from '../../../../services/search/search.service.base';
import { TrackServiceBase } from '../../../../services/track/track.service.base';
import { CollectionServiceBase } from '../../../../services/collection/collection.service.base';
import { Scheduler } from '../../../../common/scheduling/scheduler';
import { Logger } from '../../../../common/logger';
import { DateTime } from '../../../../common/date-time';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { TrackModel } from '../../../../services/track/track-model';
import { Track } from '../../../../data/entities/track';
import { TrackModels } from '../../../../services/track/track-models';

describe('CollectionTracksComponent', () => {
    let searchServiceMock: IMock<SearchServiceBase>;
    let trackServiceMock: IMock<TrackServiceBase>;
    let collectionServiceMock: IMock<CollectionServiceBase>;
    let schedulerMock: IMock<Scheduler>;
    let loggerMock: IMock<Logger>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;

    let collectionChangedMock: Subject<void>;
    let collectionChangedMock$: Observable<void>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): CollectionTracksComponent {
        const component: CollectionTracksComponent = new CollectionTracksComponent(
            searchServiceMock.object,
            trackServiceMock.object,
            collectionServiceMock.object,
            schedulerMock.object,
            loggerMock.object,
        );

        return component;
    }

    function createTrackModel(path: string): TrackModel {
        const track: Track = new Track(path);
        const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);

        return trackModel;
    }

    function createTrackModels(tracks: TrackModel[]): TrackModels {
        const trackModels: TrackModels = new TrackModels();

        for (const track of tracks) {
            trackModels.addTrack(track);
        }

        return trackModels;
    }

    beforeEach(() => {
        searchServiceMock = Mock.ofType<SearchServiceBase>();
        trackServiceMock = Mock.ofType<TrackServiceBase>();
        collectionServiceMock = Mock.ofType<CollectionServiceBase>();
        schedulerMock = Mock.ofType<Scheduler>();
        loggerMock = Mock.ofType<Logger>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();

        collectionChangedMock = new Subject();
        collectionChangedMock$ = collectionChangedMock.asObservable();
        collectionServiceMock.setup((x) => x.collectionChanged$).returns(() => collectionChangedMock$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: CollectionTracksComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define tracks as empty', () => {
            // Arrange

            // Act
            const component: CollectionTracksComponent = createComponent();

            // Assert
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should define searchService', () => {
            // Arrange

            // Act
            const component: CollectionTracksComponent = createComponent();

            // Assert
            expect(component.searchService).toBeDefined();
        });
    });

    describe('ngOnDestroy', () => {
        it('should clear the tracks', () => {
            // Arrange
            const component: CollectionTracksComponent = createComponent();
            const track: TrackModel = createTrackModel('path1');
            const trackModels: TrackModels = createTrackModels([track]);
            component.tracks = trackModels;

            // Act
            component.ngOnDestroy();

            // Assert
            expect(component.tracks.tracks.length).toEqual(0);
        });
    });

    describe('ngOnInit', () => {
        it('should get all tracks', async () => {
            // Arrange
            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionTracksComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should get all tracks if the collection has changed', async () => {
            // Arrange
            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);

            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionTracksComponent = createComponent();
            await component.ngOnInit();

            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            // Act
            collectionChangedMock.next();
            await flushPromises();

            // Assert
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });
    });
});
