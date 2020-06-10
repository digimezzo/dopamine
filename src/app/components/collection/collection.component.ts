import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-collection',
  host: { 'style': 'display: block' },
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionComponent implements OnInit {

  constructor() { }

  public ngOnInit(): void {
  }

}
