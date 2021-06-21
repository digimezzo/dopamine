import { Strings } from '../../common/strings';
import { BaseTranslatorService } from '../translator/base-translator.service';

export class GenreModel {
    constructor(private genre: string, private translatorService: BaseTranslatorService) {}

    public showHeader: boolean = false;

    public get name(): string {
        if (Strings.isNullOrWhiteSpace(this.genre)) {
            return this.translatorService.get('Genre.UnknownGenre');
        }

        return this.genre;
    }

    public get sortableName(): string {
        return Strings.getSortableString(this.genre, true);
    }
}
