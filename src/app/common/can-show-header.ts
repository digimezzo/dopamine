import { Constants } from './application/constants';
import { Strings } from './strings';

export abstract class CanShowHeader {
    public abstract name: string;
    public abstract displayName: string;

    public showHeader: boolean = false;

    public get sortableName(): string {
        return Strings.getSortableString(this.name, true);
    }

    public get header(): string {
        const firstCharacter: string = this.sortableName.charAt(0);

        if (Constants.alphabeticalHeaders.includes(firstCharacter)) {
            return firstCharacter;
        }

        return '#';
    }
}
