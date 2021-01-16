import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IMock, Mock, Times } from 'typemoq';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BackButtonComponent } from './back-button.component';

describe('BackButtonComponent', () => {
    let component: BackButtonComponent;
    let fixture: ComponentFixture<BackButtonComponent>;

    let componentWithMocks: BackButtonComponent;
    let navigationServiceMock: IMock<BaseNavigationService>;
    let indexingServiceMock: IMock<BaseIndexingService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [BackButtonComponent],
            providers: [BaseNavigationService, BaseIndexingService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BackButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
        componentWithMocks = new BackButtonComponent(navigationServiceMock.object, indexingServiceMock.object);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('goBackToCollection', () => {
        it('should navigate to collection', () => {
            // Arrange

            // Act
            componentWithMocks.goBackToCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToCollection(), Times.exactly(1));
        });

        it('should index collection if folders have changed', () => {
            // Arrange

            // Act
            componentWithMocks.goBackToCollection();

            // Assert
            indexingServiceMock.verify((x) => x.indexCollectionIfFoldersHaveChangedAsync(), Times.exactly(1));
        });
    });
});
