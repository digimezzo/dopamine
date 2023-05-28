import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { IMock, Mock, Times } from 'typemoq';
import { InputDialogComponent } from './input-dialog.component';

describe('InputDialogComponent', () => {
    let component: InputDialogComponent;
    const dataMock: any = { inputText: '' };
    let dialogRefMock: IMock<MatDialogRef<InputDialogComponent>>;

    beforeEach(() => {
        dialogRefMock = Mock.ofType<MatDialogRef<InputDialogComponent>>();

        component = new InputDialogComponent(dataMock, dialogRefMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('hasInputText', () => {
        it('should return false if inputText is undefined', () => {
            // Arrange
            component.data.inputText = undefined;

            // Act

            // Assert
            expect(component.hasInputText).toBeFalsy();
        });

        it('should return false if inputText is empty', () => {
            // Arrange
            component.data.inputText = '';

            // Act

            // Assert
            expect(component.hasInputText).toBeFalsy();
        });

        it('should return false if inputText is space', () => {
            // Arrange
            component.data.inputText = ' ';

            // Act

            // Assert
            expect(component.hasInputText).toBeFalsy();
        });

        it('should return true if inputText is not empty or space', () => {
            // Arrange
            component.data.inputText = 'My input text';

            // Act

            // Assert
            expect(component.hasInputText).toBeTruthy();
        });
    });

    describe('closeDialog', () => {
        it('should not close the dialog if inputText is undefined', () => {
            // Arrange
            component.data.inputText = undefined;

            // Act
            component.closeDialog();

            // Assert
            dialogRefMock.verify((x) => x.close(true), Times.never());
        });

        it('should not close the dialog if inputText is empty', () => {
            // Arrange
            component.data.inputText = '';

            // Act
            component.closeDialog();

            // Assert
            dialogRefMock.verify((x) => x.close(true), Times.never());
        });

        it('should not close the dialog if inputText is space', () => {
            // Arrange
            component.data.inputText = ' ';

            // Act
            component.closeDialog();

            // Assert
            dialogRefMock.verify((x) => x.close(true), Times.never());
        });

        it('should close the dialog if inputText is not empty or space', () => {
            // Arrange
            component.data.inputText = 'My input text';

            // Act
            component.closeDialog();

            // Assert
            dialogRefMock.verify((x) => x.close(true), Times.once());
        });
    });
});
