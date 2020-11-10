import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BaseDialogService } from '../../services/dialog/base-dialog.service';

@Component({
  selector: 'app-main-menu',
  host: { 'style': 'display: block' },
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainMenuComponent implements OnInit {

  constructor(public router: Router, private dialogService: BaseDialogService) { }

  public ngOnInit(): void {
  }

  public showManageCollectionDialog(): void {
    this.dialogService.showManageCollectionDialog();
  }

  public goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  public goToInformation(): void {
    this.router.navigate(['/information']);
  }
}
