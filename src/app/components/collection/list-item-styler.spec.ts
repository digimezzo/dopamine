import { IMock, Mock } from 'typemoq';
import { IStylable } from '../../common/i-stylable';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
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

    describe('getTextColorClass', () => {
        it('should return no class if track is undefined', () => {
            // Arrange
            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getTextColorClass(undefined, false, false);
            const class2: string = listItemStyler.getTextColorClass(undefined, true, false);
            const class3: string = listItemStyler.getTextColorClass(undefined, false, true);
            const class4: string = listItemStyler.getTextColorClass(undefined, true, true);

            // Assert
            expect(class1).toEqual('');
            expect(class2).toEqual('');
            expect(class3).toEqual('');
            expect(class4).toEqual('');
        });

        it('should return "selected-item-color" if stylable is selected and should override selected item text', () => {
            // Arrange
            const stylableMock: IMock<IStylable> = Mock.ofType<IStylable>();
            stylableMock.setup((x) => x.isSelected).returns(() => true);
            stylableMock.setup((x) => x.isPlaying).returns(() => false);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => true);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getTextColorClass(stylableMock.object, false, false);
            const class2: string = listItemStyler.getTextColorClass(stylableMock.object, true, false);
            const class3: string = listItemStyler.getTextColorClass(stylableMock.object, false, true);
            const class4: string = listItemStyler.getTextColorClass(stylableMock.object, true, true);

            // Assert
            expect(class1).toEqual('selected-item-color');
            expect(class2).toEqual('selected-item-color');
            expect(class3).toEqual('selected-item-color');
            expect(class4).toEqual('selected-item-color');
        });

        it('should return "accent-color" if stylable is not selected and should not override selected item text and stylable is accent text', () => {
            // Arrange
            const stylableMock: IMock<IStylable> = Mock.ofType<IStylable>();
            stylableMock.setup((x) => x.isSelected).returns(() => false);
            stylableMock.setup((x) => x.isPlaying).returns(() => false);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => false);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getTextColorClass(stylableMock.object, true, false);
            const class2: string = listItemStyler.getTextColorClass(stylableMock.object, true, true);

            // Assert
            expect(class1).toEqual('accent-color');
            expect(class2).toEqual('accent-color');
        });

        it('should return "accent-color" if stylable is not selected and should not override selected item text and stylable is playing', () => {
            // Arrange
            const stylableMock: IMock<IStylable> = Mock.ofType<IStylable>();
            stylableMock.setup((x) => x.isSelected).returns(() => false);
            stylableMock.setup((x) => x.isPlaying).returns(() => true);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => false);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getTextColorClass(stylableMock.object, false, false);
            const class2: string = listItemStyler.getTextColorClass(stylableMock.object, false, true);

            // Assert
            expect(class1).toEqual('accent-color');
            expect(class2).toEqual('accent-color');
        });

        it('should return "accent-color" if stylable is not selected and should not override selected item text and stylable is accent text and is playing', () => {
            // Arrange
            const stylableMock: IMock<IStylable> = Mock.ofType<IStylable>();
            stylableMock.setup((x) => x.isSelected).returns(() => false);
            stylableMock.setup((x) => x.isPlaying).returns(() => true);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => false);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getTextColorClass(stylableMock.object, true, false);
            const class2: string = listItemStyler.getTextColorClass(stylableMock.object, true, true);

            // Assert
            expect(class1).toEqual('accent-color');
            expect(class2).toEqual('accent-color');
        });

        it('should return "secondary-color" if stylable is not selected and should not override selected item text and stylable is not accent text and is not playing and is secondary text', () => {
            // Arrange
            const stylableMock: IMock<IStylable> = Mock.ofType<IStylable>();
            stylableMock.setup((x) => x.isSelected).returns(() => false);
            stylableMock.setup((x) => x.isPlaying).returns(() => false);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => false);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getTextColorClass(stylableMock.object, false, true);

            // Assert
            expect(class1).toEqual('secondary-color');
        });

        it('should return no class if stylable is not selected and should not override selected item text and stylable is not accent text and is not playing and is not secondary text', () => {
            // Arrange
            const stylableMock: IMock<IStylable> = Mock.ofType<IStylable>();
            stylableMock.setup((x) => x.isSelected).returns(() => false);
            stylableMock.setup((x) => x.isPlaying).returns(() => false);
            appearanceServiceMock.setup((x) => x.shouldOverrideSelectedItemText).returns(() => false);

            const listItemStyler: ListItemStyler = createListItemStyler();

            // Act
            const class1: string = listItemStyler.getTextColorClass(stylableMock.object, false, false);

            // Assert
            expect(class1).toEqual('');
        });
    });
});
