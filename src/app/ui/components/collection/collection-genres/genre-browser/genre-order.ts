export enum GenreOrder {
    byGenreAscending = 1,
    byGenreDescending = 2,
}

export function genreOrderKey(genreOrder: GenreOrder): string {
    switch (genreOrder) {
        case GenreOrder.byGenreAscending:
            return 'by-genre-ascending';
        case GenreOrder.byGenreDescending:
            return 'by-genre-descending';
    }
}
