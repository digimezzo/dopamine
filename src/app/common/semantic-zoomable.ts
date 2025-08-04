import { Constants } from './application/constants';
import { StringUtils } from './utils/string-utils';

export abstract class SemanticZoomable {
    public abstract displayName: string;

    public isZoomHeader: boolean = false;

    public get sortableName(): string {
        return StringUtils.getSortableString(this.displayName, true);
    }

    public get zoomHeader(): string {
        const firstCharacter: string = this.sortableName.charAt(0);

        if (Constants.alphabeticalHeaders.includes(firstCharacter)) {
            return firstCharacter;
        }

        return '#';
    }
}
