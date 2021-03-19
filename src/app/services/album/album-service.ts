import { Injectable } from '@angular/core';
import { BaseAlbumService } from './base-album-service';

@Injectable({
    providedIn: 'root',
})
export class AlbumService implements BaseAlbumService {
    constructor() {}
}
