import { ChangeDetectorRef } from '@angular/core';
import { RichLyricsComponent } from './rich-lyrics.component';
import { PlaybackService } from '../../../../../services/playback/playback.service';
import { SettingsBase } from '../../../../../common/settings/settings.base';

describe('RichLyricsComponent', () => {
    describe('calculateFontSize', () => {
        it('should stop shrinking at the minimum size when the lyric keeps overflowing', () => {
            const changeDetector = { detectChanges: jest.fn() } as unknown as ChangeDetectorRef;
            const component = new RichLyricsComponent({} as PlaybackService, changeDetector, {} as SettingsBase);
            const overflowingElement = { offsetWidth: 100, scrollWidth: 200 } as HTMLElement;
            const getElementsSpy = jest
                .spyOn(document, 'getElementsByClassName')
                .mockReturnValue({ 0: overflowingElement } as unknown as HTMLCollectionOf<Element>);

            (component as any).calculateFontSize();

            expect(component.mainRichLyricSize).toBeCloseTo(0.5);
            expect(changeDetector.detectChanges).toHaveBeenCalledTimes(30);
            getElementsSpy.mockRestore();
        });
    });
});