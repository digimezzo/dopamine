import { Menu } from "electron";

export abstract class MacOSDockServiceBase {
    public abstract reloadDockMenu(): void;
}