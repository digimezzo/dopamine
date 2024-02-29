class MathUtils {
    static calculatePercentage(actualValue, maximumValue) {
        return Math.round((actualValue / maximumValue) * 100);
    }
}

exports.MathUtils = MathUtils;
