import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material';
import { Router } from '@angular/router';
import { Language } from '../../core/language';
import { Constants } from '../../core/constants';
import { Settings } from '../../core/settings';
import { AppearanceService } from '../../services/appearance/appearance.service';
import { ColorTheme } from '../../core/colorTheme';
import { TranslatorService } from '../../services/translator/translator.service';

@Component({
  selector: 'app-welcome',
  host: { 'style': 'display: block' },
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent implements OnInit {

  constructor(public router: Router, private settings: Settings, public translator: TranslatorService, 
    public appearance: AppearanceService) { }

  public currentStep: number = 0;f
  public totalSteps: number = 6;

  public get canGoBack(): boolean {
    return this.currentStep > 0 && this.currentStep < this.totalSteps - 1;
  }

  public get canGoForward(): boolean {
    return this.currentStep < this.totalSteps - 1;
  }

  public get canFinish(): boolean {
    return this.currentStep == this.totalSteps - 1;
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
