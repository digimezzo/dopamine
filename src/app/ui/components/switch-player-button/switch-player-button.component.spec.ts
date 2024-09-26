import { IMock, Mock } from 'typemoq';
import { SwitchPlayerService } from '../../../services/player-switcher/switch-player.service';
import { SwitchPlayerButtonComponent } from './switch-player-button.component';

describe('SwitchPlayerButtonComponent', () => {
    let switchPlayerServiceMock: IMock<SwitchPlayerService>;

    let component: SwitchPlayerButtonComponent;

    beforeEach(() => {
        switchPlayerServiceMock = Mock.ofType<SwitchPlayerService>();

        component = new SwitchPlayerButtonComponent(switchPlayerServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act, Assert
            expect(component).toBeDefined();
        });
    });
});
