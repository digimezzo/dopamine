import { WelcomeDonateComponent } from './welcome-donate.component';
import { ContactInformation } from '../../../../common/application/contact-information';
import { IMock, Mock, Times } from 'typemoq';
import { DesktopBase } from '../../../../common/io/desktop.base';

describe('WelcomeDonateComponent', () => {
    let desktopMock: IMock<DesktopBase>;

    beforeEach(() => {
        desktopMock = Mock.ofType<DesktopBase>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: WelcomeDonateComponent = new WelcomeDonateComponent(desktopMock.object);

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('openDonateUrlAsync', () => {
        it('should browse to donate url', async () => {
            // Arrange
            const component: WelcomeDonateComponent = new WelcomeDonateComponent(desktopMock.object);

            // Act
            await component.openDonateUrlAsync();

            // Assert
            desktopMock.verify((desktop) => desktop.openLinkAsync(ContactInformation.donateUrl), Times.once());
        });
    });
});
