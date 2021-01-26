import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionTracksComponent } from './collection-tracks.component';


describe('CollectionSongsComponent', () => {
  let component: CollectionTracksComponent;
  let fixture: ComponentFixture<CollectionTracksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionTracksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
