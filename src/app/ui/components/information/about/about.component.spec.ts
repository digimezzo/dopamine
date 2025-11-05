import { IMock, Mock, Times } from 'typemoq';
import { AboutComponent } from './about.component';
import { DesktopBase } from '../../../../common/io/desktop.base';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { ProductInformation } from '../../../../common/application/product-information';
import { ContactInformation } from '../../../../common/application/contact-information';

describe('AboutComponent', () => {
    let dialogServiceMock: IMock<DialogServiceBase>;
    let desktopMock: IMock<DesktopBase>;

    let component: AboutComponent;

    beforeEach(() => {
        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        desktopMock = Mock.ofType<DesktopBase>();

        component = new AboutComponent(dialogServiceMock.object, desktopMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should set application version', () => {
            // Arrange

            // Act
            const applicationVersion: string = component.applicationVersion;

            // Assert
            expect(applicationVersion).toEqual(ProductInformation.applicationVersion);
        });

        it('should set application Copyright', () => {
            // Arrange

            // Act
            const applicationCopyright: string = component.applicationCopyright;

            // Assert
            expect(applicationCopyright).toEqual(ProductInformation.applicationCopyright);
        });

        it('should set website URL', () => {
            // Arrange

            // Act
            const websiteUrl: string = component.websiteUrl;

            // Assert
            expect(websiteUrl).toEqual(ContactInformation.websiteUrl);
        });

        it('should set Bluesky URL', () => {
            // Arrange

            // Act
            const blueskyUrl: string = component.blueskyUrl;

            // Assert
            expect(blueskyUrl).toEqual(ContactInformation.blueskyUrl);
        });

        it('should set Twitter URL', () => {
            // Arrange

            // Act
            const twitterUrl: string = component.twitterUrl;

            // Assert
            expect(twitterUrl).toEqual(ContactInformation.twitterUrl);
        });

        it('should set GitHub URL', () => {
            // Arrange

            // Act
            const githubUrl: string = component.githubUrl;

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
        it('should open the donate link in the default browser', async () => {
            // Arrange

            // Act
            await component.browseToDonateLinkAsync();

            // Assert
            desktopMock.verify((x) => x.openLinkAsync(ContactInformation.donateUrl), Times.exactly(1));
        });
    });
});
