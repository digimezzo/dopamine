export abstract class TrayServiceBase {
    public abstract invertNotificationAreaIconColor: boolean;
    public abstract get needInvertNotificationAreaIconColor(): boolean;
    public abstract updateTrayContextMenu(): void;
}
