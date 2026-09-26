import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleSwitchComponent } from './toggle-switch.component';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { SettingsMock } from '../../../../testing/settings-mock';

describe('ToggleSwitchComponent', () => {
  let component: ToggleSwitchComponent;
  let fixture: ComponentFixture<ToggleSwitchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToggleSwitchComponent],
      providers: [{ provide: SettingsBase, useValue: new SettingsMock() }]
    });
    fixture = TestBed.createComponent(ToggleSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
