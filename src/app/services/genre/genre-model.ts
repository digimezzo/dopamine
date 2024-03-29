import { SemanticZoomable } from '../../common/semantic-zoomable';
import { StringUtils } from '../../common/utils/string-utils';
import { ISelectable } from '../../ui/interfaces/i-selectable';
import { TranslatorServiceBase } from '../translator/translator.service.base';

export class GenreModel extends SemanticZoomable implements ISelectable {
    public constructor(
        public name: string,
        private translatorService: TranslatorServiceBase,
    ) {
        super();
    }

    public isSelected: boolean = false;

    public get displayName(): string {
        if (StringUtils.isNullOrWhiteSpace(this.name)) {
            return this.translatorService.get('unknown-genre');
        }

        return this.name;
    }
}
