import { Injectable } from '@angular/core';
import { Settings } from '../../core/settings';

@Injectable({
  providedIn: 'root'
})
export class IndexingService {

  constructor(private settings: Settings) { }

  public myTest(): string {
    const shouldShowWelcome: boolean = this.settings.showWelcome;

    return 'Hello!';
  }
}
