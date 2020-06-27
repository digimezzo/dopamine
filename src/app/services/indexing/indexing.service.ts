import { Injectable } from '@angular/core';
import { Settings } from '../../core/settings';
import { IndexingServiceBase } from './indexing-service-base';

@Injectable({
  providedIn: 'root'
})
export class IndexingService implements IndexingServiceBase {
  constructor(private settings: Settings) { }
}
