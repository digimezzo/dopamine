import { Constants } from '../../common/application/constants';
import { Strings } from '../../common/strings';
import { BaseTranslatorService } from '../translator/base-translator.service';

export class GenreModel {
    constructor(private genre: string, private translatorService: BaseTranslatorService) {}

    public isSelected: boolean = false;
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

    public get alphabeticalHeader(): string {
        const firstCharacter: string = this.sortableName.charAt(0);

        if (Constants.alphabeticalHeaders.includes(firstCharacter)) {
            return firstCharacter;
        }

        return '#';
    }
}
