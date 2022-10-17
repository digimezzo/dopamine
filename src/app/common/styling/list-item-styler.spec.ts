import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { IPlayable } from './i-playable';
import { ISelectable } from './i-selectable';
import { ListItemStyler } from './list-item-styler';

describe('ListItemStyler', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    function createListItemStyler(): ListItemStyler {
        return new ListItemStyler(appearanceServiceMock.object);
    }

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const listItemStyler: ListItemStyler = createListItemStyler();

            // Assert
            expect(listItemStyler).toBeDefined();
        });
    });

    describe('getPlayableColorClass', () => {
        it('should return no class if track is undefined', () => {
            // Arrange
            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getPlayableColorClass(undefined, false, false);
            const class2: string = listItemStyler.getPlayableColorClass(undefined, true, false);
            const class3: string = listItemStyler.getPlayableColorClass(undefined, false, true);
            const class4: string = listItemStyler.getPlayableColorClass(undefined, true, true);

            // Assert
            expect(class1).toEqual('');
            expect(class2).toEqual('');
            expect(class3).toEqual('');
            expect(class4).toEqual('');
        });

        it('should return "selected-item-color" if stylable is selected and should override selected item text', () => {
            // Arrange
            const playableMock: IMock<IPlayable> = Mock.ofType<IPlayable>();
            playableMock.setup((x) => x.isSelected).returns(() => true);
            playableMock.setup((x) => x.isPlaying).returns(() => false);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => true);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getPlayableColorClass(playableMock.object, false, false);
            const class2: string = listItemStyler.getPlayableColorClass(playableMock.object, true, false);
            const class3: string = listItemStyler.getPlayableColorClass(playableMock.object, false, true);
            const class4: string = listItemStyler.getPlayableColorClass(playableMock.object, true, true);

            // Assert
            expect(class1).toEqual('selected-item-color');
            expect(class2).toEqual('selected-item-color');
            expect(class3).toEqual('selected-item-color');
            expect(class4).toEqual('selected-item-color');
        });

        it('should return "accent-color" if stylable is not selected and should not override selected item text and stylable is accent text', () => {
            // Arrange
            const playableMock: IMock<IPlayable> = Mock.ofType<IPlayable>();
            playableMock.setup((x) => x.isSelected).returns(() => false);
            playableMock.setup((x) => x.isPlaying).returns(() => false);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => false);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getPlayableColorClass(playableMock.object, true, false);
            const class2: string = listItemStyler.getPlayableColorClass(playableMock.object, true, true);

            // Assert
            expect(class1).toEqual('accent-color');
            expect(class2).toEqual('accent-color');
        });

        it('should return "accent-color" if stylable is not selected and should not override selected item text and stylable is playing', () => {
            // Arrange
            const playableMock: IMock<IPlayable> = Mock.ofType<IPlayable>();
            playableMock.setup((x) => x.isSelected).returns(() => false);
            playableMock.setup((x) => x.isPlaying).returns(() => true);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => false);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getPlayableColorClass(playableMock.object, false, false);
            const class2: string = listItemStyler.getPlayableColorClass(playableMock.object, false, true);

            // Assert
            expect(class1).toEqual('accent-color');
            expect(class2).toEqual('accent-color');
        });

        it('should return "accent-color" if stylable is not selected and should not override selected item text and stylable is accent text and is playing', () => {
            // Arrange
            const playableMock: IMock<IPlayable> = Mock.ofType<IPlayable>();
            playableMock.setup((x) => x.isSelected).returns(() => false);
            playableMock.setup((x) => x.isPlaying).returns(() => true);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => false);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getPlayableColorClass(playableMock.object, true, false);
            const class2: string = listItemStyler.getPlayableColorClass(playableMock.object, true, true);

            // Assert
            expect(class1).toEqual('accent-color');
            expect(class2).toEqual('accent-color');
        });

        it('should return "secondary-color" if stylable is not selected and should not override selected item text and stylable is not accent text and is not playing and is secondary text', () => {
            // Arrange
            const playableMock: IMock<IPlayable> = Mock.ofType<IPlayable>();
            playableMock.setup((x) => x.isSelected).returns(() => false);
            playableMock.setup((x) => x.isPlaying).returns(() => false);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => false);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getPlayableColorClass(playableMock.object, false, true);

            // Assert
            expect(class1).toEqual('secondary-color');
        });

        it('should return no class if stylable is not selected and should not override selected item text and stylable is not accent text and is not playing and is not secondary text', () => {
            // Arrange
            const playableMock: IMock<IPlayable> = Mock.ofType<IPlayable>();
            playableMock.setup((x) => x.isSelected).returns(() => false);
            playableMock.setup((x) => x.isPlaying).returns(() => false);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => false);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getPlayableColorClass(playableMock.object, false, false);

            // Assert
            expect(class1).toEqual('');
        });
    });

    describe('getSelectableColorClass', () => {
        it('should return no class if track is undefined', () => {
            // Arrange
            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getSelectableColorClass(undefined, false);
            const class2: string = listItemStyler.getSelectableColorClass(undefined, true);

            // Assert
            expect(class1).toEqual('');
            expect(class2).toEqual('');
        });

        it('should return "selected-item-color" if selectable is selected and should override selected item text', () => {
            // Arrange
            const selectableMock: IMock<ISelectable> = Mock.ofType<ISelectable>();
            selectableMock.setup((x) => x.isSelected).returns(() => true);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => true);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getSelectableColorClass(selectableMock.object, false);
            const class2: string = listItemStyler.getSelectableColorClass(selectableMock.object, true);

            // Assert
            expect(class1).toEqual('selected-item-color');
            expect(class2).toEqual('selected-item-color');
        });

        it('should return "secondary-color" if selectable is not selected and should not override selected item text and selectable is secondary text', () => {
            // Arrange
            const selectableMock: IMock<ISelectable> = Mock.ofType<ISelectable>();
            selectableMock.setup((x) => x.isSelected).returns(() => false);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => false);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getSelectableColorClass(selectableMock.object, true);

            // Assert
            expect(class1).toEqual('secondary-color');
        });

        it('should return no class if selectable is not selected and should not override selected item text and selectable is not secondary text', () => {
            // Arrange
            const selectableMock: IMock<ISelectable> = Mock.ofType<ISelectable>();
            selectableMock.setup((x) => x.isSelected).returns(() => false);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => false);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getSelectableColorClass(selectableMock.object, false);

            // Assert
            expect(class1).toEqual('');
        });
    });
});
