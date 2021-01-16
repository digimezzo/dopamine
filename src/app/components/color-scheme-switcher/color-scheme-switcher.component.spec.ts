import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { ColorSchemeSwitcherComponent } from './color-scheme-switcher.component';

describe('ColorSchemeSwitcherComponent', () => {
    let component: ColorSchemeSwitcherComponent;
    let fixture: ComponentFixture<ColorSchemeSwitcherComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ColorSchemeSwitcherComponent],
            providers: [BaseAppearanceService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSchemeSwitcherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
