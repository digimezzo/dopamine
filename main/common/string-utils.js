class StringUtils {
    static isNullOrWhiteSpace(stringToCheck) {
        if (stringToCheck === undefined || stringToCheck === null) {
            return true;
        }

        try {
            if (stringToCheck.trim() === '') {
                return true;
            }
        } catch (e) {
            return true;
        }

        return false;
    }
}

exports.StringUtils = StringUtils;
