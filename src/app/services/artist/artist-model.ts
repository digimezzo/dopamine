import { Constants } from '../../common/application/constants';
import { Strings } from '../../common/strings';
import { BaseTranslatorService } from '../translator/base-translator.service';

export class ArtistModel {
    constructor(private artist: string, private translatorService: BaseTranslatorService) {}

    public isSelected: boolean = false;
    public showHeader: boolean = false;

    public get name(): string {
        if (Strings.isNullOrWhiteSpace(this.artist)) {
            return this.translatorService.get('Artist.UnknownArtist');
        }

        return this.artist;
    }

    public get sortableName(): string {
        return Strings.getSortableString(this.artist, true);
    }

    public get alphabeticalHeader(): string {
        const firstCharacter: string = this.sortableName.charAt(0);

        if (Constants.alphabeticalHeaders.includes(firstCharacter)) {
            return firstCharacter;
        }

        return '#';
    }
}
