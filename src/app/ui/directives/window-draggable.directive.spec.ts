import { NgZone } from '@angular/core';
import * as remote from '@electron/remote';
import { IMock, Mock } from 'typemoq';
import { AppearanceServiceBase } from '../../services/appearance/appearance.service.base';
import { WindowDraggableDirective } from './window-draggable.directive';

jest.mock('@electron/remote', () => ({
    getCurrentWindow: jest.fn(),
    process: {
        platform: 'linux',
    },
}));

describe('WindowDraggableDirective', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let zone: NgZone;

    function createDirective(): WindowDraggableDirective {
        return new WindowDraggableDirective(zone, appearanceServiceMock.object);
    }

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        zone = new NgZone({ enableLongStackTrace: false });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('onMouseDown', () => {
        it('should not start dragging when the window has a native title bar', () => {
            appearanceServiceMock.setup((x) => x.windowHasNativeTitleBar).returns(() => true);
            const getCurrentWindowMock = remote.getCurrentWindow as jest.Mock;
            const directive: WindowDraggableDirective = createDirective();

            directive.onMouseDown(new MouseEvent('mousedown', { button: 0 }));

            expect(getCurrentWindowMock).not.toHaveBeenCalled();
        });

        it('should start dragging when the window does not have a native title bar', () => {
            appearanceServiceMock.setup((x) => x.windowHasNativeTitleBar).returns(() => false);

            const addEventListenerSpy = jest.spyOn(document, 'addEventListener').mockImplementation(() => undefined);
            const win = {
                getPosition: jest.fn().mockReturnValue([10, 20]),
                getSize: jest.fn().mockReturnValue([300, 400]),
            };
            const getCurrentWindowMock = remote.getCurrentWindow as jest.Mock;
            getCurrentWindowMock.mockReturnValue(win as never);
            const directive: WindowDraggableDirective = createDirective();

            directive.onMouseDown(new MouseEvent('mousedown', { button: 0 }));

            expect(getCurrentWindowMock).toHaveBeenCalledTimes(1);
            expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
            expect(win.getPosition).toHaveBeenCalledTimes(1);
            expect(win.getSize).toHaveBeenCalledTimes(1);
        });
    });
});
