import { Router } from '@angular/router';
import { IMock, Mock, Times } from 'typemoq';
import { BackButtonComponent } from '../app/components/back-button/back-button.component';

describe('BackButtonComponent', () => {
    describe('gobackToCollection', () => {
        it('Should navigate back to collection', () => {
             // Arrange
             const routerMock: IMock<Router> = Mock.ofType<Router>();
             const backButtonComponent: BackButtonComponent = new BackButtonComponent(routerMock.object);

             // Act
             backButtonComponent.goBackToCollection();

             // Assert
             routerMock.verify(x => x.navigate(['/collection']), Times.exactly(1));
        });
    });
});
