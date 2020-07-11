import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';

export abstract class DialogServiceBase {
    public abstract async showConfirmationDialogAsync(dialogTitle: string, dialogText: string): Promise<boolean>;
    public abstract showErrorDialog(errorText: string): void;
}
