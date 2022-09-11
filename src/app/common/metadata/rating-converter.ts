export class RatingConverter {
    public static starToPopMRating(starRating: number): number {
        // 5 stars = POPM 255
        // 4 stars = POPM 196
        // 3 stars = POPM 128
        // 2 stars = POPM 64
        // 1 stars = POPM 1
        // 0 stars = POPM 0

        switch (starRating) {
            case 0:
                return 0;
            case 1:
                return 1;
            case 2:
                return 64;
            case 3:
                return 128;
            case 4:
                return 196;
            case 5:
                return 255;
            default:
                // Should not happen
                return 0;
        }
    }

    public static popM2StarRating(popMRating: number): number {
        // 0 stars = POPM 0
        // 1 stars = POPM 1
        // 2 stars = POPM 64
        // 3 stars = POPM 128
        // 4 stars = POPM 196
        // 5 stars = POPM 255

        if (popMRating <= 0) {
            return 0;
        } else if (popMRating <= 1) {
            return 1;
        } else if (popMRating <= 64) {
            return 2;
        } else if (popMRating <= 128) {
            return 3;
        } else if (popMRating <= 196) {
            return 4;
        } else if (popMRating <= 255) {
            return 5;
        } else {
            return 0;
            // Should not happen
        }
    }
}
