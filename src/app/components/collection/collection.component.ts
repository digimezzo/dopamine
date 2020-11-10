import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';

@Component({
  selector: 'app-collection',
  host: { 'style': 'display: block' },
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionComponent implements OnInit {

  constructor(
    public appearanceService: BaseAppearanceService) { }

  public async ngOnInit(): Promise<void> {
  }
}
