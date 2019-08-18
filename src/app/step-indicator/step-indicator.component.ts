import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.scss']
})
export class StepIndicatorComponent implements OnInit {

  constructor() { 
  }
  
  public totalStepsCollection: number[];

  @Input() public totalSteps: number;
  @Input() public currentStep: number;

  ngOnInit() {
    this.totalStepsCollection = Array(this.totalSteps).fill(1).map((x,i)=>i);
  }
}
