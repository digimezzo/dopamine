import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseDatabaseMigrator } from '../../data/base-database-migrator';

@Component({
    selector: 'app-loading',
    host: { 'style': 'display: block' },
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoadingComponent implements OnInit {

    constructor(public router: Router, private databaseMigrator: BaseDatabaseMigrator, public appearanceService: BaseAppearanceService) { }

    public async ngOnInit(): Promise<void> {
        await this.databaseMigrator.migrateAsync();
        this.router.navigate(['/main']);
    }
}
