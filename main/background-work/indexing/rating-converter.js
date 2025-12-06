/**
 * POPM (Popularimeter) rating values are not standardized across music players.
 * Most applications only support full-star ratings, and those that support half-stars
 * often use different mappings. The values below reflect the most commonly reported
 * mappings for MusicBee and MediaMonkey, gathered from user forums and community
 * documentation.
 *
 * Star Rating to POPM Value
 * 0.0 stars (starRating = 0) = popMRating 0
 * 0.5 stars (starRating = 1) = popMRating 13
 * 1.0 stars (starRating = 2) = popMRating 1
 * 1.5 stars (starRating = 3) = popMRating 54
 * 2.0 stars (starRating = 4) = popMRating 64
 * 2.5 stars (starRating = 5) = popMRating 118
 * 3.0 stars (starRating = 6) = popMRating 128
 * 3.5 stars (starRating = 7) = popMRating 186
 * 4.0 stars (starRating = 8) = popMRating 196
 * 4.5 stars (starRating = 9) = popMRating 242
 * 5.0 stars (starRating = 10) = popMRating 255
 */
class RatingConverter {
    static starToPopMRating(starRating) {
        switch (starRating) {
            case 0:
                return 0;
            case 1:
                return 13;
            case 2:
                return 1;
            case 3:
                return 54;
            case 4:
                return 64;
            case 5:
                return 118;
            case 6:
                return 128;
            case 7:
                return 186;
            case 8:
                return 196;
            case 9:
                return 242;
            case 10:
                return 255;
            default:
                // Should not happen
                return 0;
        }
    }

    static popMToStarRating(popMRating) {
        // Full stars can be directly mapped
        if (popMRating === 0) {
            return 0;
        } else if (popMRating === 1) {
            return 2;
        } else if (popMRating === 64) {
            return 4;
        } else if (popMRating === 128) {
            return 6;
        } else if (popMRating === 196) {
            return 8;
        } else if (popMRating === 255) {
            return 10;
        }

        // Half stars
        if (popMRating < 54) {
            return 1;
        } else if (popMRating < 64) {
            return 3;
        } else if (popMRating < 128) {
            return 5;
        } else if (popMRating < 196) {
            return 7;
        } else if (popMRating < 255) {
            return 9;
        } else {
            // Should not happen
            return 0;
        }
    }
}

exports.RatingConverter = RatingConverter;
