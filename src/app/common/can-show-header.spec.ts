import { CanShowHeader } from './can-show-header';

export class CanShowHeaderImplementation extends CanShowHeader {
    public name: string;
    public displayName: string;
    public showHeader: boolean;
}

describe('CanShowHeader', () => {
    let canShowHeader: CanShowHeader;

    beforeEach(() => {
        canShowHeader = new CanShowHeaderImplementation();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange
            // Act
            // Assert
            expect(canShowHeader).toBeDefined();
        });

        it('should define showHeader as false', () => {
            // Arrange
            // Act
            // Assert
            expect(canShowHeader.showHeader).toBeFalsy();
        });
    });

    describe('sortableName', () => {
        it('should return a sortable name', () => {
            // Arrange
            canShowHeader = new CanShowHeaderImplementation();
            canShowHeader.name = 'The Text';

            // Act
            const sortableName: string = canShowHeader.sortableName;

            // Assert
            expect(sortableName).toEqual('text');
        });
    });

    describe('header', () => {
        it('should return a header containing a letter if the first letter is known as alphabetical header', () => {
            // Arrange
            canShowHeader = new CanShowHeaderImplementation();
            canShowHeader.name = 'The Text';

            // Act
            const header: string = canShowHeader.header;

            // Assert
            expect(header).toEqual('t');
        });

        it('should return a header containing a letter if the first letter is not known as alphabetical header', () => {
            // Arrange
            canShowHeader = new CanShowHeaderImplementation();
            canShowHeader.name = '1 Text';

            // Act
            const header: string = canShowHeader.header;

            // Assert
            expect(header).toEqual('#');
        });
    });
});
