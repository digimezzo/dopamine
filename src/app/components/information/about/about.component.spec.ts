import { IMock, Mock, Times } from 'typemoq';
import { ContactInformation } from '../../../common/application/contact-information';
import { ProductInformation } from '../../../common/application/product-information';
import { BaseDesktop } from '../../../common/io/base-desktop';
import { BaseDialogService } from '../../../services/dialog/base-dialog.service';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
    let dialogServiceMock: IMock<BaseDialogService>;
    let desktopMock: IMock<BaseDesktop>;

    let component: AboutComponent;

    beforeEach(() => {
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        desktopMock = Mock.ofType<BaseDesktop>();

        component = new AboutComponent(dialogServiceMock.object, desktopMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should set application version', async () => {
            // Arrange

            // Act
            const applicationVersion: string = await component.applicationVersion;

            // Assert
            expect(applicationVersion).toEqual(ProductInformation.applicationVersion);
        });

        it('should set application Copyright', async () => {
            // Arrange

            // Act
            const applicationCopyright: string = await component.applicationCopyright;

            // Assert
            expect(applicationCopyright).toEqual(ProductInformation.applicationCopyright);
        });

        it('should set website URL', async () => {
            // Arrange

            // Act
            const websiteUrl: string = await component.websiteUrl;

            // Assert
            expect(websiteUrl).toEqual(ContactInformation.websiteUrl);
        });

        it('should set Twitter URL', async () => {
            // Arrange

            // Act
            const twitterUrl: string = await component.twitterUrl;

            // Assert
            expect(twitterUrl).toEqual(ContactInformation.twitterUrl);
        });

        it('should set GitHub URL', async () => {
            // Arrange

            // Act
            const githubUrl: string = await component.githubUrl;

            // Assert
            expect(githubUrl).toEqual(ContactInformation.githubUrl);
        });
    });
    describe('showLicenseDialog', () => {
        it('should open a license dialog', () => {
            // Arrange

            // Act
            component.showLicenseDialog();

            // Assert
            dialogServiceMock.verify((x) => x.showLicenseDialog(), Times.exactly(1));
        });
    });

    describe('browseToDonateLink', () => {
        it('should open the donate link in the default browser', () => {
            // Arrange

            // Act
            component.browseToDonateLink();

            // Assert
            desktopMock.verify((x) => x.openLink(ContactInformation.donateUrl), Times.exactly(1));
        });
    });
});
