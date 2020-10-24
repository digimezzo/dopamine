import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  host: { 'style': 'display: block' },
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BackButtonComponent implements OnInit {

  constructor(public router: Router) { }

  public ngOnInit(): void {
  }

  public goBackToCollection(): void {
    this.router.navigate(['/collection']);
  }
}
