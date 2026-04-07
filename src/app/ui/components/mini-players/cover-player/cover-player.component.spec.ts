import { CoverPlayerComponent } from './cover-player.component';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { IMock, Mock } from 'typemoq';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';
import { AudioVisualizer } from '../../../../services/playback/audio-visualizer';
import { AudioVisualizerServiceBase } from '../../../../services/audio-visualizer/audio-visualizer.service.base';
import { DocumentProxy } from '../../../../common/io/document-proxy';
import { ContextMenuOpener } from '../../context-menu-opener';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { DesktopBase } from '../../../../common/io/desktop.base';

describe('CoverPlayerComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let settingsMock: IMock<SettingsBase>;
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let matBottomSheetMock: IMock<MatBottomSheet>;
    let audioVisualizerMock: IMock<AudioVisualizer>;
    let audioVisualizerServiceMock: IMock<AudioVisualizerServiceBase>;
    let documentProxyMock: IMock<DocumentProxy>;
    let desktopMock: IMock<DesktopBase>;

    let component: CoverPlayerComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        settingsMock = Mock.ofType<SettingsBase>();
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        matBottomSheetMock = Mock.ofType<MatBottomSheet>();
        audioVisualizerMock = Mock.ofType<AudioVisualizer>();
        audioVisualizerServiceMock = Mock.ofType<AudioVisualizerServiceBase>();
        documentProxyMock = Mock.ofType<DocumentProxy>();
        desktopMock = Mock.ofType<DesktopBase>();
        component = new CoverPlayerComponent(
            appearanceServiceMock.object,
            contextMenuOpenerMock.object,
            settingsMock.object,
            navigationServiceMock.object,
            matBottomSheetMock.object,
            audioVisualizerServiceMock.object,
            audioVisualizerMock.object,
            documentProxyMock.object,
            desktopMock.object,
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Assert
            expect(component).toBeDefined();
        });
    });
});
