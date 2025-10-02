import { CoverPlayerComponent } from './cover-player.component';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { IMock, Mock } from 'typemoq';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';
import { AudioVisualizer } from '../../../../services/playback/audio-visualizer';
import { DocumentProxy } from '../../../../common/io/document-proxy';

describe('CoverPlayerComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let matBottomSheetMock: IMock<MatBottomSheet>;
    let audioVisualizerMock: IMock<AudioVisualizer>;
    let documentProxyMock: IMock<DocumentProxy>;

    let component: CoverPlayerComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        matBottomSheetMock = Mock.ofType<MatBottomSheet>();
        audioVisualizerMock = Mock.ofType<AudioVisualizer>();
        documentProxyMock = Mock.ofType<DocumentProxy>();
        component = new CoverPlayerComponent(
            appearanceServiceMock.object,
            navigationServiceMock.object,
            matBottomSheetMock.object,
            audioVisualizerMock.object,
            documentProxyMock.object,
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Assert
            expect(component).toBeDefined();
        });
    });
});
