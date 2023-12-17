import { WelcomeDonateComponent } from './welcome-donate.component';
import { ContactInformation } from '../../../../common/application/contact-information';

describe('WelcomeDonateComponent', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: WelcomeDonateComponent = new WelcomeDonateComponent();

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('donateUrl', () => {
        it('should return donateUrl from ContactInformation', () => {
            // Arrange
            const component: WelcomeDonateComponent = new WelcomeDonateComponent();

            // Act, Assert
            expect(component.donateUrl).toEqual(ContactInformation.donateUrl);
        });
    });
});
