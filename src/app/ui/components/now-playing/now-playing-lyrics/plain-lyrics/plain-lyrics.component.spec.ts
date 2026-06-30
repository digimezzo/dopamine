import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainLyricsComponent } from './plain-lyrics.component';
import { LyricsModel } from '../../../../../services/lyrics/lyrics-model';
import { LyricsSourceType } from '../../../../../common/api/lyrics/lyrics-source-type';
import { MockCreator } from '../../../../../testing/mock-creator';

describe('PlainLyricsComponent', () => {
    let component: PlainLyricsComponent;
    let fixture: ComponentFixture<PlainLyricsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PlainLyricsComponent],
        });

        fixture = TestBed.createComponent(PlainLyricsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('should convert the configured lyrics font size to vmin', () => {
        const track = MockCreator.createTrackModel('path', 'title', ';artist;');
        component.lyrics = LyricsModel.plain(track, 'source', LyricsSourceType.online, 'line one\nline two');
        component.fontSize = 2;

        fixture.detectChanges();

        const lyricsElement: HTMLDivElement = fixture.nativeElement.querySelector('.app-plain-lyrics');

        expect(component.fontSizeInVmin).toEqual('4vmin');
        expect(lyricsElement.textContent).toEqual('line one\nline two');
    });
});
