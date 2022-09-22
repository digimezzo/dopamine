import { Constants } from './application/constants';
import { Strings } from './strings';

export abstract class SemanticZoomable {
    public abstract name: string;
    public abstract displayName: string;

    public isZoomHeader: boolean = false;

    public get sortableName(): string {
        return Strings.getSortableString(this.name, true);
    }

    public get zoomHeader(): string {
        const firstCharacter: string = this.sortableName.charAt(0);

        if (Constants.alphabeticalHeaders.includes(firstCharacter)) {
            return firstCharacter;
        }

        return '#';
    }
}
