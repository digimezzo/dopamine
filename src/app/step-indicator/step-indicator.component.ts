import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.scss']
})
export class StepIndicatorComponent implements OnInit {

  constructor() { 
    this.totalStepsCollection = Array(5).fill(1).map((x,i)=>i);
  }
  public totalStepsCollection: number[];

  @Input() public totalSteps: number;
  @Input() public activeStep: number;

  ngOnInit() {
  }
}
