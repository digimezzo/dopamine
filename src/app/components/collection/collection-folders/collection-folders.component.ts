import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SplitAreaDirective, SplitComponent } from 'angular-split';
import { Logger } from '../../../core/logger';

@Component({
  selector: 'app-collection-folders',
  host: { 'style': 'display: block' },
  templateUrl: './collection-folders.component.html',
  styleUrls: ['./collection-folders.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionFoldersComponent implements OnInit {
  @ViewChild('split', { static: false }) public split: SplitComponent;
  @ViewChild('area1', { static: false }) public area1: SplitAreaDirective;
  @ViewChild('area2', { static: false }) public area2: SplitAreaDirective;

  constructor(private logger: Logger) { }

  public area1Size: string = '30';
  public area2Size: string = '70';

  public ngOnInit(): void {
  }

  public dragEnd(unit: string, { sizes }: any): void {
    if (unit === 'percent') {
      this.logger.info(`area1=${sizes[0]}%,area2=${sizes[1]}%`, 'CollectionFoldersComponent', 'dragEnd');
    }
  }
}
