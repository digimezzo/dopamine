import { MatDialogRef } from '@angular/material';
import { IMock, It, Mock, Times } from 'typemoq';
import { InputDialogComponent } from './input-dialog.component';

describe('InputDialogComponent', () => {
    let component: InputDialogComponent;
    let dialogRefMock: IMock<MatDialogRef<InputDialogComponent>>;

    beforeEach(() => {
        dialogRefMock = Mock.ofType<MatDialogRef<InputDialogComponent>>();

        component = new InputDialogComponent(It.isAny(), dialogRefMock.object);
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
            component.inputText = undefined;

            // Act

            // Assert
            expect(component.hasInputText).toBeFalsy();
        });

        it('should return false if inputText is empty', () => {
            // Arrange
            component.inputText = '';

            // Act

            // Assert
            expect(component.hasInputText).toBeFalsy();
        });

        it('should return false if inputText is space', () => {
            // Arrange
            component.inputText = ' ';

            // Act

            // Assert
            expect(component.hasInputText).toBeFalsy();
        });

        it('should return true if inputText is not empty or space', () => {
            // Arrange
            component.inputText = 'My input text';

            // Act

            // Assert
            expect(component.hasInputText).toBeTruthy();
        });
    });

    describe('closeDialog', () => {
        it('should not close the dialog if inputText is undefined', () => {
            // Arrange
            component.inputText = undefined;

            // Act
            component.closeDialog();

            // Assert
            dialogRefMock.verify((x) => x.close(true), Times.never());
        });

        it('should not close the dialog if inputText is empty', () => {
            // Arrange
            component.inputText = '';

            // Act
            component.closeDialog();

            // Assert
            dialogRefMock.verify((x) => x.close(true), Times.never());
        });

        it('should not close the dialog if inputText is space', () => {
            // Arrange
            component.inputText = ' ';

            // Act
            component.closeDialog();

            // Assert
            dialogRefMock.verify((x) => x.close(true), Times.never());
        });

        it('should close the dialog if inputText is not empty or space', () => {
            // Arrange
            component.inputText = 'My input text';

            // Act
            component.closeDialog();

            // Assert
            dialogRefMock.verify((x) => x.close(true), Times.once());
        });
    });
});
