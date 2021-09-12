import { Strings } from '../common/strings';

export class BaseFilterPipe {
    constructor() {}

    public containsText(originalText: string, textToContain: string): boolean {
        if (Strings.isNullOrWhiteSpace(originalText)) {
            return false;
        }

        if (Strings.removeAccents(originalText).toLowerCase().includes(textToContain.toLowerCase())) {
            return true;
        }

        return false;
    }
}
