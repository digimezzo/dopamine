import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material';
import { Router } from '@angular/router';
import { Language } from '../../core/language';
import { Constants } from '../../core/constants';
import { Settings } from '../../core/settings';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent implements OnInit {

  constructor(public router: Router, private settings: Settings, private translate: TranslateService) { }

  public currentStep: number = 0;
  public totalSteps: number = 6;

  public languages: Language[] = Constants.languages;

  public get canGoBack(): boolean {
    return this.currentStep > 0 && this.currentStep < this.totalSteps - 1;
  }

  public get canGoForward(): boolean {
    return this.currentStep < this.totalSteps - 1;
  }

  public get canFinish(): boolean {
    return this.currentStep == this.totalSteps - 1;
  }

  public get selectedLanguage(): Language {
    let languageCode: string = this.settings.language;
    return this.languages.find(x => x.code === languageCode);
  }
  
  public set selectedLanguage(v: Language) {
    this.settings.language = v.code;
    this.translate.use(v.code);
  }

  ngOnInit() {
  }

  public goBack(stepper: MatStepper): void {
    if (this.canGoBack) {
      stepper.previous();
      this.currentStep--;
    }
  }

  public goForward(stepper: MatStepper): void {
    if (this.canGoForward) {
      stepper.next();
      this.currentStep++;
    }
  }

  public finish(): void {
    this.router.navigate(['/collection']);
  }
}
