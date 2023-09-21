import { SemanticZoomable } from '../../common/semantic-zoomable';
import { Strings } from '../../common/strings';
import { ISelectable } from '../../interfaces/i-selectable';
import { BaseTranslatorService } from '../translator/base-translator.service';

export class GenreModel extends SemanticZoomable implements ISelectable {
    constructor(public name: string, private translatorService: BaseTranslatorService) {
        super();
    }

    public isSelected: boolean = false;

    public get displayName(): string {
        if (Strings.isNullOrWhiteSpace(this.name)) {
            return this.translatorService.get('unknown-genre');
        }

        return this.name;
    }
}
