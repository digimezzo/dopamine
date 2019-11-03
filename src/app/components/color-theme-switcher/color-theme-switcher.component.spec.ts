import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorThemeSwitcherComponent } from './color-theme-switcher.component';
import { AppearanceService } from '../../services/appearance/appearance.service';
import { AppearanceServiceStub } from '../../services/appearance/appearanceServiceStub';
import { MatTooltipModule } from '@angular/material';

describe('ColorThemeSwitcherComponent', () => {
  let component: ColorThemeSwitcherComponent;
  let fixture: ComponentFixture<ColorThemeSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorThemeSwitcherComponent ],
      providers: [
        { provide: AppearanceService, useClass: AppearanceServiceStub }
      ],
      imports: [
        MatTooltipModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorThemeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
