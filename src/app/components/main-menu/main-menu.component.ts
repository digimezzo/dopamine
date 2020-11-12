import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  host: { 'style': 'display: block' },
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainMenuComponent implements OnInit {

  constructor(public router: Router) { }

  public ngOnInit(): void {
  }

  public goToManageCollection(): void {
    this.router.navigate(['/managecollection']);
  }

  public goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  public goToInformation(): void {
    this.router.navigate(['/information']);
  }
}
