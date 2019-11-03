import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingComponent } from './loading.component';
import { MatProgressSpinnerModule } from '@angular/material';
import { WindowControlsComponent } from '../window-controls/window-controls.component';
import { LogoFullComponent } from '../logo-full/logo-full.component';
import { TranslateModule } from '@ngx-translate/core';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingComponent, WindowControlsComponent, LogoFullComponent ],
      imports: [
        MatProgressSpinnerModule,
          TranslateModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
