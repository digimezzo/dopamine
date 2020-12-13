import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';

@Component({
  selector: 'app-back-button',
  host: { 'style': 'display: block' },
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BackButtonComponent implements OnInit {

  constructor(public router: Router, private indexingService: BaseIndexingService) { }

  public ngOnInit(): void {
  }

  public goBackToCollection(): void {
    this.router.navigate(['/collection']);
    this.indexingService.indexCollectionIfFoldersHaveChangedAsync();
  }
}
