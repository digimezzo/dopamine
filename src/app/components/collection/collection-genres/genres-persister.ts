import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Logger } from '../../../common/logger';
import { BaseSettings } from '../../../common/settings/base-settings';
import { Strings } from '../../../common/strings';
import { GenreModel } from '../../../services/genre/genre-model';
import { GenreOrder } from './genre-browser/genre-order';

@Injectable()
export class GenresPersister {
    private selectedGenreNames: string[] = [];
    private selectedGenreOrder: GenreOrder;
    private selectedGenresChanged: Subject<string[]> = new Subject();

    constructor(public settings: BaseSettings, public logger: Logger) {
        this.initializeFromSettings();
    }

    public selectedGenresChanged$: Observable<string[]> = this.selectedGenresChanged.asObservable();

    public getSelectedGenres(availableGenres: GenreModel[]): GenreModel[] {
        if (availableGenres == undefined) {
            return [];
        }

        if (availableGenres.length === 0) {
            return [];
        }

        try {
            return availableGenres.filter((x) => this.selectedGenreNames.includes(x.displayName));
        } catch (e) {
            this.logger.error(`Could not get selected genres. Error: ${e.message}`, 'GenresPersister', 'getSelectedGenres');
        }

        return [];
    }

    public setSelectedGenres(selectedGenres: GenreModel[]): void {
        try {
            if (selectedGenres != undefined && selectedGenres.length > 0) {
                this.selectedGenreNames = selectedGenres.map((x) => x.displayName);
            } else {
                this.selectedGenreNames = [];
            }

            if (this.selectedGenreNames.length > 0) {
                this.saveSelectedGenreToSettings(this.selectedGenreNames[0]);
            } else {
                this.saveSelectedGenreToSettings('');
            }

            this.selectedGenresChanged.next(this.selectedGenreNames);
        } catch (e) {
            this.logger.error(`Could not set selected genres. Error: ${e.message}`, 'GenresPersister', 'setSelectedGenres');
        }
    }

    public getSelectedGenreOrder(): GenreOrder {
        if (this.selectedGenreOrder == undefined) {
            return GenreOrder.byGenreAscending;
        }

        return this.selectedGenreOrder;
    }

    public setSelectedGenreOrder(selectedGenreOrder: GenreOrder): void {
        try {
            this.selectedGenreOrder = selectedGenreOrder;
            this.saveSelectedGenreOrderToSettings(GenreOrder[selectedGenreOrder]);
        } catch (e) {
            this.logger.error(`Could not set selected genre order. Error: ${e.message}`, 'GenresPersister', 'setSelectedGenreOrder');
        }
    }

    private initializeFromSettings(): void {
        if (!Strings.isNullOrWhiteSpace(this.getSelectedGenreFromSettings())) {
            this.selectedGenreNames = [this.getSelectedGenreFromSettings()];
        }

        if (!Strings.isNullOrWhiteSpace(this.getSelectedGenreOrderFromSettings())) {
            this.selectedGenreOrder = (GenreOrder as any)[this.getSelectedGenreOrderFromSettings()];
        }
    }

    private getSelectedGenreFromSettings(): string {
        return this.settings.genresTabSelectedGenre;
    }

    private saveSelectedGenreToSettings(selectedGenre: string): void {
        this.settings.genresTabSelectedGenre = selectedGenre;
    }

    private getSelectedGenreOrderFromSettings(): string {
        return this.settings.genresTabSelectedGenreOrder;
    }

    private saveSelectedGenreOrderToSettings(selectedGenreOrderName: string): void {
        this.settings.genresTabSelectedGenreOrder = selectedGenreOrderName;
    }
}
