export abstract class BaseDialogService {
    public abstract showConfirmationDialogAsync(dialogTitle: string, dialogText: string): Promise<boolean>;
    public abstract showErrorDialog(errorText: string): void;
    public abstract showLicenseDialog(): void;
}
