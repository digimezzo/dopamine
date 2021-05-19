import { Injectable } from '@angular/core';
import { BaseAlbumsPersister } from '../base-albums-persister';

@Injectable({
    providedIn: 'root',
})
export class AlbumsPersister extends BaseAlbumsPersister {}
