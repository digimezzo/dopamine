import { Injectable } from '@angular/core';
import { Settings } from '../../core/settings';
import { Indexing } from './indexing';

@Injectable({
  providedIn: 'root'
})
export class IndexingService implements Indexing {

  constructor(private settings: Settings) { }

  public myTest(): string {
    const shouldShowWelcome: boolean = this.settings.showWelcome;

    return 'Hello!';
  }
}
