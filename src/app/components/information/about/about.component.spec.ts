import assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { ContactInformation } from '../../../core/base/contact-information';
import { ProductInformation } from '../../../core/base/product-information';
import { Desktop } from '../../../core/io/desktop';
import { BaseDialogService } from '../../../services/dialog/base-dialog.service';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
    let dialogServiceMock: IMock<BaseDialogService>;
    let desktopMock: IMock<Desktop>;

    let component: AboutComponent;

    beforeEach(() => {
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        desktopMock = Mock.ofType<Desktop>();

        component = new AboutComponent(dialogServiceMock.object, desktopMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(component);
        });

        it('should set application version', async () => {
            // Arrange

            // Act
            const applicationVersion: string = await component.applicationVersion;

            // Assert
            assert.strictEqual(applicationVersion, ProductInformation.applicationVersion);
        });

        it('should set application Copyright', async () => {
            // Arrange

            // Act
            const applicationCopyright: string = await component.applicationCopyright;

            // Assert
            assert.strictEqual(applicationCopyright, ProductInformation.applicationCopyright);
        });

        it('should set website URL', async () => {
            // Arrange

            // Act
            const websiteUrl: string = await component.websiteUrl;

            // Assert
            assert.strictEqual(websiteUrl, ContactInformation.websiteUrl);
        });

        it('should set Twitter URL', async () => {
            // Arrange

            // Act
            const twitterUrl: string = await component.twitterUrl;

            // Assert
            assert.strictEqual(twitterUrl, ContactInformation.twitterUrl);
        });

        it('should set GitHub URL', async () => {
            // Arrange

            // Act
            const githubUrl: string = await component.githubUrl;

            // Assert
            assert.strictEqual(githubUrl, ContactInformation.githubUrl);
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
