import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { ContactInformation } from '../../../core/base/contact-information';
import { ProductInformation } from '../../../core/base/product-information';
import { Desktop } from '../../../core/io/desktop';
import { BaseDialogService } from '../../../services/dialog/base-dialog.service';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
    let component: AboutComponent;
    let fixture: ComponentFixture<AboutComponent>;

    let dialogServiceMock: IMock<BaseDialogService>;
    let desktopMock: IMock<Desktop>;
    let componentWithMocks: AboutComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [AboutComponent],
            providers: [BaseDialogService, Desktop],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        dialogServiceMock = Mock.ofType<BaseDialogService>();
        desktopMock = Mock.ofType<Desktop>();
        componentWithMocks = new AboutComponent(dialogServiceMock.object, desktopMock.object);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('constructor', () => {
        it('should set application version', async () => {
            // Arrange

            // Act
            const applicationVersion: string = await componentWithMocks.applicationVersion;

            // Assert
            assert.strictEqual(applicationVersion, ProductInformation.applicationVersion);
        });

        it('should set application Copyright', async () => {
            // Arrange

            // Act
            const applicationCopyright: string = await componentWithMocks.applicationCopyright;

            // Assert
            assert.strictEqual(applicationCopyright, ProductInformation.applicationCopyright);
        });

        it('should set website URL', async () => {
            // Arrange

            // Act
            const websiteUrl: string = await componentWithMocks.websiteUrl;

            // Assert
            assert.strictEqual(websiteUrl, ContactInformation.websiteUrl);
        });

        it('should set Twitter URL', async () => {
            // Arrange

            // Act
            const twitterUrl: string = await componentWithMocks.twitterUrl;

            // Assert
            assert.strictEqual(twitterUrl, ContactInformation.twitterUrl);
        });

        it('should set GitHub URL', async () => {
            // Arrange

            // Act
            const githubUrl: string = await componentWithMocks.githubUrl;

            // Assert
            assert.strictEqual(githubUrl, ContactInformation.githubUrl);
        });
    });
    describe('showLicenseDialog', () => {
        it('should open a license dialog', () => {
            // Arrange

            // Act
            componentWithMocks.showLicenseDialog();

            // Assert
            dialogServiceMock.verify((x) => x.showLicenseDialog(), Times.exactly(1));
        });
    });

    describe('browseToDonateLink', () => {
        it('should open the donate link in the default browser', () => {
            // Arrange

            // Act
            componentWithMocks.browseToDonateLink();

            // Assert
            desktopMock.verify((x) => x.openLink(ContactInformation.donateUrl), Times.exactly(1));
        });
    });
});
