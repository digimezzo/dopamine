import { Palette } from './palette';

describe('Palette', () => {
    let palette: Palette;

    beforeEach(() => {
        palette = new Palette('#E91E63');
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(palette).toBeDefined();
        });
    });

    describe('color50', () => {
        it('should return #ffffff', () => {
            // Arrange

            // Act
            const color50: string = palette.color50;

            // Assert
            expect(color50).toEqual('#ffffff');
        });
    });

    describe('color100', () => {
        it('should return #facada', () => {
            // Arrange

            // Act
            const color50: string = palette.color100;

            // Assert
            expect(color50).toEqual('#facada');
        });
    });

    describe('color200', () => {
        it('should return #f597b7', () => {
            // Arrange

            // Act
            const color50: string = palette.color200;

            // Assert
            expect(color50).toEqual('#f597b7');
        });
    });

    describe('color300', () => {
        it('should return #ee568a', () => {
            // Arrange

            // Act
            const color50: string = palette.color300;

            // Assert
            expect(color50).toEqual('#ee568a');
        });
    });

    describe('color400', () => {
        it('should return #ec3a76', () => {
            // Arrange

            // Act
            const color50: string = palette.color400;

            // Assert
            expect(color50).toEqual('#ec3a76');
        });
    });

    describe('color500', () => {
        it('should return #e91e63', () => {
            // Arrange

            // Act
            const color50: string = palette.color500;

            // Assert
            expect(color50).toEqual('#e91e63');
        });
    });

    describe('color600', () => {
        it('should return #d41556', () => {
            // Arrange

            // Act
            const color50: string = palette.color600;

            // Assert
            expect(color50).toEqual('#d41556');
        });
    });

    describe('color700', () => {
        it('should return #b8124a', () => {
            // Arrange

            // Act
            const color50: string = palette.color700;

            // Assert
            expect(color50).toEqual('#b8124a');
        });
    });

    describe('color800', () => {
        it('should return #9c0f3f', () => {
            // Arrange

            // Act
            const color50: string = palette.color800;

            // Assert
            expect(color50).toEqual('#9c0f3f');
        });
    });

    describe('color900', () => {
        it('should return #800d34', () => {
            // Arrange

            // Act
            const color50: string = palette.color900;

            // Assert
            expect(color50).toEqual('#800d34');
        });
    });

    describe('colorA100', () => {
        it('should return #ffffff', () => {
            // Arrange

            // Act
            const color50: string = palette.colorA100;

            // Assert
            expect(color50).toEqual('#ffffff');
        });
    });

    describe('colorA200', () => {
        it('should return #ffa1c1', () => {
            // Arrange

            // Act
            const color50: string = palette.colorA200;

            // Assert
            expect(color50).toEqual('#ffa1c1');
        });
    });

    describe('colorA400', () => {
        it('should return #fc3e7e', () => {
            // Arrange

            // Act
            const color50: string = palette.colorA400;

            // Assert
            expect(color50).toEqual('#fc3e7e');
        });
    });

    describe('colorA700', () => {
        it('should return #f13071', () => {
            // Arrange

            // Act
            const color50: string = palette.colorA700;

            // Assert
            expect(color50).toEqual('#f13071');
        });
    });
});
