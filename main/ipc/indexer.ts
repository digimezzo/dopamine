import { ipcMain } from 'electron';

export function configureIndexerIpc(): void {
    ipcMain.on('indexer-test', (event: any, arg: any) => {
        // TODO
    });
}
