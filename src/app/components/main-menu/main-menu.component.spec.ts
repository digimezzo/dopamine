import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { IMock, Mock, Times } from 'typemoq';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { MainMenuComponent } from './main-menu.component';

describe('MainMenuComponent', () => {
    let navigationServiceMock: IMock<BaseNavigationService>;
    let componentWithInjection: MainMenuComponent;

    let component: MainMenuComponent;
    let fixture: ComponentFixture<MainMenuComponent>;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        componentWithInjection = new MainMenuComponent(navigationServiceMock.object);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), MatMenuModule],
            declarations: [MainMenuComponent],
            providers: [{ provide: BaseNavigationService, useFactory: () => navigationServiceMock.object }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('goToManageCollection', () => {
        it('should navigate to manage collection', () => {
            // Arrange

            // Act
            componentWithInjection.goToManageCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToManageCollection(), Times.exactly(1));
        });
    });

    describe('goToSettings', () => {
        it('should navigate to settings', () => {
            // Arrange

            // Act
            componentWithInjection.goToSettings();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToSettings(), Times.exactly(1));
        });
    });

    describe('goToInformation', () => {
        it('should navigate to information', () => {
            // Arrange

            // Act
            componentWithInjection.goToInformation();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToInformation(), Times.exactly(1));
        });
    });
});
