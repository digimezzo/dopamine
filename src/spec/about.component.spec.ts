import * as assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { AboutComponent } from '../app/components/information/about/about.component';
import { ContactInformation } from '../app/core/base/contact-information';
import { ProductInformation } from '../app/core/base/product-information';
import { Desktop } from '../app/core/io/desktop';
import { BaseDialogService } from '../app/services/dialog/base-dialog.service';

describe('AboutComponent', () => {
    describe('constructor', () => {
        it('Should set application version', async () => {
            // Arrange
            const dialogServiceMock: IMock<BaseDialogService> = Mock.ofType<BaseDialogService>();
            const desktopMock: IMock<Desktop> = Mock.ofType<Desktop>();
            const aboutComponent: AboutComponent = new AboutComponent(dialogServiceMock.object, desktopMock.object);

            // Act
            const applicationVersion: string = await aboutComponent.applicationVersion;

            // Assert
            assert.strictEqual(applicationVersion, ProductInformation.applicationVersion);
        });

        it('Should set application Copyright', async () => {
            // Arrange
            const dialogServiceMock: IMock<BaseDialogService> = Mock.ofType<BaseDialogService>();
            const desktopMock: IMock<Desktop> = Mock.ofType<Desktop>();
            const aboutComponent: AboutComponent = new AboutComponent(dialogServiceMock.object, desktopMock.object);

            // Act
            const applicationCopyright: string = await aboutComponent.applicationCopyright;

            // Assert
            assert.strictEqual(applicationCopyright, ProductInformation.applicationCopyright);
        });

        it('Should set website URL', async () => {
            // Arrange
            const dialogServiceMock: IMock<BaseDialogService> = Mock.ofType<BaseDialogService>();
            const desktopMock: IMock<Desktop> = Mock.ofType<Desktop>();
            const aboutComponent: AboutComponent = new AboutComponent(dialogServiceMock.object, desktopMock.object);

            // Act
            const websiteUrl: string = await aboutComponent.websiteUrl;

            // Assert
            assert.strictEqual(websiteUrl, ContactInformation.websiteUrl);
        });

        it('Should set Twitter URL', async () => {
            // Arrange
            const dialogServiceMock: IMock<BaseDialogService> = Mock.ofType<BaseDialogService>();
            const desktopMock: IMock<Desktop> = Mock.ofType<Desktop>();
            const aboutComponent: AboutComponent = new AboutComponent(dialogServiceMock.object, desktopMock.object);

            // Act
            const twitterUrl: string = await aboutComponent.twitterUrl;

            // Assert
            assert.strictEqual(twitterUrl, ContactInformation.twitterUrl);
        });

        it('Should set GitHub URL', async () => {
            // Arrange
            const dialogServiceMock: IMock<BaseDialogService> = Mock.ofType<BaseDialogService>();
            const desktopMock: IMock<Desktop> = Mock.ofType<Desktop>();
            const aboutComponent: AboutComponent = new AboutComponent(dialogServiceMock.object, desktopMock.object);

            // Act
            const githubUrl: string = await aboutComponent.githubUrl;

            // Assert
            assert.strictEqual(githubUrl, ContactInformation.githubUrl);
        });
    });
    describe('showLicenseDialog', () => {
        it('Should open a license dialog', () => {
            // Arrange
            const dialogServiceMock: IMock<BaseDialogService> = Mock.ofType<BaseDialogService>();
            const desktopMock: IMock<Desktop> = Mock.ofType<Desktop>();
            const aboutComponent: AboutComponent = new AboutComponent(dialogServiceMock.object, desktopMock.object);

            // Act
            aboutComponent.showLicenseDialog();

            // Assert
            dialogServiceMock.verify((x) => x.showLicenseDialog(), Times.exactly(1));
        });
    });

    describe('browseToDonateLink', () => {
        it('Should open the donate link in the default browser', () => {
            // Arrange
            const dialogServiceMock: IMock<BaseDialogService> = Mock.ofType<BaseDialogService>();
            const desktopMock: IMock<Desktop> = Mock.ofType<Desktop>();
            const aboutComponent: AboutComponent = new AboutComponent(dialogServiceMock.object, desktopMock.object);

            // Act
            aboutComponent.browseToDonateLink();

            // Assert
            desktopMock.verify((x) => x.openLink(ContactInformation.donateUrl), Times.exactly(1));
        });
    });
});
