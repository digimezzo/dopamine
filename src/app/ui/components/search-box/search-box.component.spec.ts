import { IMock, Mock, Times } from 'typemoq';
import { SearchBoxComponent } from './search-box.component';
import { SearchServiceBase } from '../../../services/search/search.service.base';
import { ElementRef } from '@angular/core';
import { DocumentProxy } from '../../../common/io/document-proxy';

describe('SearchBoxComponent', () => {
    let searchServiceMock: IMock<SearchServiceBase>;
    let documentProxyMock: IMock<DocumentProxy>;
    let appSearchBoxRefMock: IMock<ElementRef>;
    let appSearchBoxMock: IMock<HTMLInputElement>;
    let component: SearchBoxComponent;

    beforeEach(() => {
        searchServiceMock = Mock.ofType<SearchServiceBase>();
        documentProxyMock = Mock.ofType<DocumentProxy>();
        appSearchBoxRefMock = Mock.ofType<ElementRef>();
        appSearchBoxMock = Mock.ofType<HTMLInputElement>();

        appSearchBoxRefMock.setup((x) => x.nativeElement).returns(() => appSearchBoxMock.object);

        component = createComponent();
        component.appSearchBoxRef = appSearchBoxRefMock.object;
    });

    function createComponent(): SearchBoxComponent {
        return new SearchBoxComponent(searchServiceMock.object, documentProxyMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define searchService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.searchService).toBeDefined();
        });

        it('should define appSearchBoxRef', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appSearchBoxRef).toBeDefined();
        });
    });

    describe('clearSearchText', () => {
        it('should clear the search text', () => {
            // Arrange

            // Act
            component.clearSearchText();

            // Assert
            searchServiceMock.verify((x) => (x.searchText = ''), Times.once());
        });
    });

    describe('handleKeyboardEvent', () => {
        it('should do nothing when appSearchBoxRef is undefined', () => {
            // Arrange
            component = createComponent();

            const event = new KeyboardEvent('keydown', {
                key: 'Escape',
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(component.appSearchBoxRef).toBeUndefined();
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should blur appSearchBox on Escape', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => appSearchBoxMock.object);

            const event = new KeyboardEvent('keydown', {
                key: 'Escape',
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            appSearchBoxMock.verify((x) => x.blur(), Times.once());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should not blur appSearchBox on non-Escape', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => appSearchBoxMock.object);

            const event = new KeyboardEvent('keydown', {
                key: 'a',
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should not blur non-active appSearchBox on Escape', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => null);

            const event = new KeyboardEvent('keydown', {
                key: 'Escape',
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should focus appSearchBox on Ctrl+KeyF', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => null);

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: true,
                metaKey: false,
                shiftKey: false,
                altKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.once());
        });

        it('should focus appSearchBox on Meta+KeyF (macOS)', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => null);

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: false,
                metaKey: true,
                shiftKey: false,
                altKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.once());
        });

        it('should not focus appSearchBox on Ctrl+KeyF if appSearchBox is active', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => appSearchBoxMock.object);

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: true,
                metaKey: false,
                shiftKey: false,
                altKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should not focus appSearchBox on Meta+KeyF (macOS) if appSearchBox is active', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => appSearchBoxMock.object);

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: false,
                metaKey: true,
                shiftKey: false,
                altKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should not focus appSearchBox on Ctrl+Shift+KeyF', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => null);

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: true,
                metaKey: false,
                shiftKey: true,
                altKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should not focus appSearchBox on Meta+Shift+KeyF (macOS)', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => null);

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: false,
                metaKey: true,
                shiftKey: true,
                altKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should not focus appSearchBox on Ctrl+Alt+KeyF', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => null);

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: true,
                metaKey: false,
                shiftKey: false,
                altKey: true,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should not focus appSearchBox on Meta+Alt+KeyF (macOS)', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => null);

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: false,
                metaKey: true,
                shiftKey: false,
                altKey: true,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should not focus appSearchBox on Ctrl+Alt+Shift+KeyF', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => null);

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: true,
                metaKey: false,
                shiftKey: true,
                altKey: true,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should not focus appSearchBox on Meta+Alt+Shift+KeyF (macOS)', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => null);

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: false,
                metaKey: true,
                shiftKey: true,
                altKey: true,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should not focus appSearchBox on Ctrl+non-KeyF', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => null);

            const event = new KeyboardEvent('keydown', {
                code: 'KeyA',
                ctrlKey: true,
                metaKey: false,
                shiftKey: false,
                altKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should not focus appSearchBox on Meta+non-KeyF (macOS)', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => null);

            const event = new KeyboardEvent('keydown', {
                code: 'KeyA',
                ctrlKey: false,
                metaKey: true,
                shiftKey: false,
                altKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });

        it('should not focus appSearchBox on KeyF', () => {
            // Arrange
            documentProxyMock.setup((x) => x.getActiveElement()).returns(() => null);

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: false,
                metaKey: false,
                shiftKey: false,
                altKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            appSearchBoxMock.verify((x) => x.blur(), Times.never());
            appSearchBoxMock.verify((x) => x.focus(), Times.never());
        });
    });
});
