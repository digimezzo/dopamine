import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { IMock, Mock, Times } from 'typemoq';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { MainMenuComponent } from './main-menu.component';

describe('MainMenuComponent', () => {
    let component: MainMenuComponent;
    let fixture: ComponentFixture<MainMenuComponent>;

    let navigationServiceMock: IMock<BaseNavigationService>;
    let componentWithMocks: MainMenuComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), MatMenuModule],
            declarations: [MainMenuComponent],
            providers: [BaseNavigationService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        componentWithMocks = new MainMenuComponent(navigationServiceMock.object);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('goToManageCollection', () => {
        it('should navigate to manage collection', () => {
            // Arrange

            // Act
            componentWithMocks.goToManageCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToManageCollection(), Times.exactly(1));
        });
    });

    describe('goToSettings', () => {
        it('should navigate to settings', () => {
            // Arrange

            // Act
            componentWithMocks.goToSettings();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToSettings(), Times.exactly(1));
        });
    });

    describe('goToInformation', () => {
        it('should navigate to information', () => {
            // Arrange

            // Act
            componentWithMocks.goToInformation();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToInformation(), Times.exactly(1));
        });
    });
});
