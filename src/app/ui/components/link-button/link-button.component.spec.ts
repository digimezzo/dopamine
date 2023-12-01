import { LinkButtonComponent } from './link-button.component';

describe('LinkButtonComponent', () => {
    let component: LinkButtonComponent;

    beforeEach(() => {
        component = new LinkButtonComponent();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act, Assert
            expect(component).toBeDefined();
        });

        it('should declare icon', () => {
            // Arrange, Act, Assert
            expect(component.icon).toBeUndefined();
        });

        it('should declare text', () => {
            // Arrange, Act, Assert
            expect(component.text).toBeUndefined();
        });
    });
});
