import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent implements OnInit {

  constructor() { }

  public currentStep: number = 0;
  public totalSteps: number = 6;

  ngOnInit() {
  }

  public goBack(stepper: MatStepper): void {
    if (this.currentStep > 0) {
      stepper.previous();
      this.currentStep--;
    }
  }

  public goForward(stepper: MatStepper): void {
    if (this.currentStep < this.totalSteps - 1) {
      stepper.next();
      this.currentStep++;
    }
  }

  public finish(): void{
    
  }
}
