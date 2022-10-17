import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../../common/settings/base-settings';
import { ListItemStyler } from '../../../common/styling/list-item-styler';
import { TrackComponent } from './track.component';

describe('TrackComponent', () => {
    let listItemStylerMock: IMock<ListItemStyler>;
    let settingsMock: IMock<BaseSettings>;
    let component: TrackComponent;

    beforeEach(() => {
        listItemStylerMock = Mock.ofType<ListItemStyler>();
        settingsMock = Mock.ofType<BaseSettings>();

        component = new TrackComponent(listItemStylerMock.object, settingsMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should declare but not define Track', () => {
            // Arrange

            // Act

            // Assert
            expect(component.track).toBeUndefined();
        });

        it('should define canShowHeader as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.canShowHeader).toBeFalsy();
        });

        it('should define listItemStyler', () => {
            // Arrange

            // Act

            // Assert
            expect(component.listItemStyler).toBeDefined();
        });

        it('should define settings', () => {
            // Arrange

            // Act

            // Assert
            expect(component.settings).toBeDefined();
        });
    });
});
