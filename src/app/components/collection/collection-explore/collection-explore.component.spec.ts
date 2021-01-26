import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionExploreComponent } from './collection-explore.component';


describe('CollectionExplorerComponent', () => {
  let component: CollectionExploreComponent;
  let fixture: ComponentFixture<CollectionExploreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionExploreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
