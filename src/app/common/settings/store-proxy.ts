import Store from 'electron-store';
import { Injectable } from '@angular/core';

@Injectable()
export class StoreProxy {
    public readonly store: Store<any> = new Store();
}
