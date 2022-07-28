import { CanShowHeader } from './can-show-header';
import { HeaderShower } from './header-shower';

export class CanShowHeaderImplementation extends CanShowHeader {
    public name: string;
    public displayName: string;
}

describe('HeaderShower', () => {
    let headerShower: HeaderShower;

    const canShowHeader1: CanShowHeader = new CanShowHeaderImplementation();
    canShowHeader1.name = 'Header 1';
    const canShowHeader2: CanShowHeader = new CanShowHeaderImplementation();
    canShowHeader2.name = 'Header 2';
    const canShowHeader3: CanShowHeader = new CanShowHeaderImplementation();
    canShowHeader3.name = 'Another header 1';
    const canShowHeader4: CanShowHeader = new CanShowHeaderImplementation();
    canShowHeader4.name = 'Another header 2';

    beforeEach(() => {
        headerShower = new HeaderShower();
    });

    describe('showHeaders', () => {
        it('should show the headers', () => {
            // Arrange
            const canShowHeaders: CanShowHeader[] = [canShowHeader1, canShowHeader2, canShowHeader3, canShowHeader4];

            // Act
            headerShower.showHeaders(canShowHeaders);

            // Assert
            expect(canShowHeaders[0].showHeader).toBeTruthy();
            expect(canShowHeaders[1].showHeader).toBeFalsy();
            expect(canShowHeaders[2].showHeader).toBeTruthy();
            expect(canShowHeaders[3].showHeader).toBeFalsy();
        });
    });
});
