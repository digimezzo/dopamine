import { IMock, Mock, Times } from 'typemoq';
import { SearchBoxComponent } from './search-box.component';
import { SearchServiceBase } from '../../../services/search/search.service.base';

describe('SearchBoxComponent', () => {
    let searchServiceMock: IMock<SearchServiceBase>;
    let component: SearchBoxComponent;

    beforeEach(() => {
        searchServiceMock = Mock.ofType<SearchServiceBase>();
        component = new SearchBoxComponent(searchServiceMock.object);
    });

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
        const appSearchBoxId = 'app-search-box';

        afterEach(() => {
            const appSearchBox = document.getElementById(appSearchBoxId);
            if (appSearchBox) {
                document.body.removeChild(appSearchBox);
            }
        });

        it(`should blur #${appSearchBoxId} input on Escape key press`, () => {
            // Arrange
            const appSearchBox = document.createElement('input');
            appSearchBox.id = appSearchBoxId;
            document.body.appendChild(appSearchBox);
            const blurSpy = jest.spyOn(appSearchBox, 'blur');
            const focusSpy = jest.spyOn(appSearchBox, 'focus');

            const event = new KeyboardEvent('keydown', {
                key: 'Escape',
            });
            Object.defineProperty(event, 'target', { value: appSearchBox });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(blurSpy).toHaveBeenCalledTimes(1);
            expect(focusSpy).not.toHaveBeenCalled();
        });

        it(`should not blur #${appSearchBoxId} input on not Escape key press`, () => {
            // Arrange
            const appSearchBox = document.createElement('input');
            appSearchBox.id = appSearchBoxId;
            document.body.appendChild(appSearchBox);
            const blurSpy = jest.spyOn(appSearchBox, 'blur');
            const focusSpy = jest.spyOn(appSearchBox, 'focus');

            const event = new KeyboardEvent('keydown', {
                key: 'a',
            });
            Object.defineProperty(event, 'target', { value: appSearchBox });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(blurSpy).not.toHaveBeenCalled();
            expect(focusSpy).not.toHaveBeenCalled();
        });

        it('should not blur other inputs on Escape key press', () => {
            // Arrange
            const appSearchBox = document.createElement('input');
            appSearchBox.id = 'other-input';
            document.body.appendChild(appSearchBox);
            const blurSpy = jest.spyOn(appSearchBox, 'blur');
            const focusSpy = jest.spyOn(appSearchBox, 'focus');

            const event = new KeyboardEvent('keydown', {
                key: 'Escape',
            });
            Object.defineProperty(event, 'target', { value: appSearchBox });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(blurSpy).not.toHaveBeenCalled();
            expect(focusSpy).not.toHaveBeenCalled();

            document.body.removeChild(appSearchBox);
        });

        it(`should focus #${appSearchBoxId} input on Ctrl+KeyF`, () => {
            // Arrange
            const appSearchBox = document.createElement('input');
            appSearchBox.id = appSearchBoxId;
            document.body.appendChild(appSearchBox);
            const blurSpy = jest.spyOn(appSearchBox, 'blur');
            const focusSpy = jest.spyOn(appSearchBox, 'focus');

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: true,
                metaKey: false,
                shiftKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(blurSpy).not.toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalledTimes(1);
        });

        it(`should focus #${appSearchBoxId} input on Meta+KeyF (macOS)`, () => {
            // Arrange
            const appSearchBox = document.createElement('input');
            appSearchBox.id = appSearchBoxId;
            document.body.appendChild(appSearchBox);
            const blurSpy = jest.spyOn(appSearchBox, 'blur');
            const focusSpy = jest.spyOn(appSearchBox, 'focus');

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: false,
                metaKey: true,
                shiftKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(blurSpy).not.toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalledTimes(1);
        });

        it(`should not focus #${appSearchBoxId} input on Ctrl+KeyF if target is #${appSearchBoxId}`, () => {
            // Arrange
            const appSearchBox = document.createElement('input');
            appSearchBox.id = appSearchBoxId;
            document.body.appendChild(appSearchBox);
            const blurSpy = jest.spyOn(appSearchBox, 'blur');
            const focusSpy = jest.spyOn(appSearchBox, 'focus');

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: true,
                metaKey: false,
                shiftKey: false,
            });
            Object.defineProperty(event, 'target', { value: appSearchBox });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(blurSpy).not.toHaveBeenCalled();
            expect(focusSpy).not.toHaveBeenCalled();
        });

        it(`should not focus #${appSearchBoxId} input on Meta+KeyF (macOS) if target is #${appSearchBoxId}`, () => {
            // Arrange
            const appSearchBox = document.createElement('input');
            appSearchBox.id = appSearchBoxId;
            document.body.appendChild(appSearchBox);
            const blurSpy = jest.spyOn(appSearchBox, 'blur');
            const focusSpy = jest.spyOn(appSearchBox, 'focus');

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: false,
                metaKey: true,
                shiftKey: false,
            });
            Object.defineProperty(event, 'target', { value: appSearchBox });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(blurSpy).not.toHaveBeenCalled();
            expect(focusSpy).not.toHaveBeenCalled();
        });

        it(`should not focus #${appSearchBoxId} input on Ctrl+Shift+KeyF`, () => {
            // Arrange
            const appSearchBox = document.createElement('input');
            appSearchBox.id = appSearchBoxId;
            document.body.appendChild(appSearchBox);
            const blurSpy = jest.spyOn(appSearchBox, 'blur');
            const focusSpy = jest.spyOn(appSearchBox, 'focus');

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: true,
                metaKey: false,
                shiftKey: true,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(blurSpy).not.toHaveBeenCalled();
            expect(focusSpy).not.toHaveBeenCalled();
        });

        it(`should not focus #${appSearchBoxId} input on Meta+Shift+KeyF (macOS)`, () => {
            // Arrange
            const appSearchBox = document.createElement('input');
            appSearchBox.id = appSearchBoxId;
            document.body.appendChild(appSearchBox);
            const blurSpy = jest.spyOn(appSearchBox, 'blur');
            const focusSpy = jest.spyOn(appSearchBox, 'focus');

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: false,
                metaKey: true,
                shiftKey: true,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(blurSpy).not.toHaveBeenCalled();
            expect(focusSpy).not.toHaveBeenCalled();
        });

        it(`should not focus #${appSearchBoxId} input on Ctrl+non-KeyF`, () => {
            // Arrange
            const appSearchBox = document.createElement('input');
            appSearchBox.id = appSearchBoxId;
            document.body.appendChild(appSearchBox);
            const blurSpy = jest.spyOn(appSearchBox, 'blur');
            const focusSpy = jest.spyOn(appSearchBox, 'focus');

            const event = new KeyboardEvent('keydown', {
                code: 'KeyA',
                ctrlKey: true,
                metaKey: false,
                shiftKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(blurSpy).not.toHaveBeenCalled();
            expect(focusSpy).not.toHaveBeenCalled();
        });

        it(`should not focus #${appSearchBoxId} input on Meta+non-KeyF (macOS)`, () => {
            // Arrange
            const appSearchBox = document.createElement('input');
            appSearchBox.id = appSearchBoxId;
            document.body.appendChild(appSearchBox);
            const blurSpy = jest.spyOn(appSearchBox, 'blur');
            const focusSpy = jest.spyOn(appSearchBox, 'focus');

            const event = new KeyboardEvent('keydown', {
                code: 'KeyA',
                ctrlKey: false,
                metaKey: true,
                shiftKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(blurSpy).not.toHaveBeenCalled();
            expect(focusSpy).not.toHaveBeenCalled();
        });

        it(`should not focus #${appSearchBoxId} input on KeyF`, () => {
            // Arrange
            const appSearchBox = document.createElement('input');
            appSearchBox.id = appSearchBoxId;
            document.body.appendChild(appSearchBox);
            const blurSpy = jest.spyOn(appSearchBox, 'blur');
            const focusSpy = jest.spyOn(appSearchBox, 'focus');

            const event = new KeyboardEvent('keydown', {
                code: 'KeyF',
                ctrlKey: false,
                metaKey: false,
                shiftKey: false,
            });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

            // Act
            component.handleKeyboardEvent(event);

            // Assert
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(blurSpy).not.toHaveBeenCalled();
            expect(focusSpy).not.toHaveBeenCalled();
        });
    });
});
