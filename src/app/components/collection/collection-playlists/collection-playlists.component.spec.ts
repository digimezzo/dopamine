import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionPlaylistsComponent } from './collection-playlists.component';

describe('CollectionPlaylistsComponent', () => {
  let component: CollectionPlaylistsComponent;
  let fixture: ComponentFixture<CollectionPlaylistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionPlaylistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
