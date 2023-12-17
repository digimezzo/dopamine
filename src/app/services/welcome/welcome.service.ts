import { Injectable } from '@angular/core';
import { WelcomeServiceBase } from './welcome.service.base';

@Injectable()
export class WelcomeService implements WelcomeServiceBase {
    public isLoaded: boolean;
}
