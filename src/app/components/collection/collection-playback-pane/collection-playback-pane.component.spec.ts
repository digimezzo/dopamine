import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CollectionPlaybackPaneComponent } from './collection-playback-pane.component';

describe('CollectionPlaybackPaneComponent', () => {
    let component: CollectionPlaybackPaneComponent;
    let fixture: ComponentFixture<CollectionPlaybackPaneComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [CollectionPlaybackPaneComponent],
            providers: [],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CollectionPlaybackPaneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
