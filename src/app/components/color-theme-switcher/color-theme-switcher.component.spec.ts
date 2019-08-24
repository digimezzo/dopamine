import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorThemeSwitcherComponent } from './color-theme-switcher.component';

describe('ColorThemeSwitcherComponent', () => {
  let component: ColorThemeSwitcherComponent;
  let fixture: ComponentFixture<ColorThemeSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorThemeSwitcherComponent ]
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
