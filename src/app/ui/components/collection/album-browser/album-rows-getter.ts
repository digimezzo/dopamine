import { Injectable } from '@angular/core';
import { Constants } from '../../../../common/application/constants';
import { AlbumModel } from '../../../../services/album/album-model';
import { AlbumOrder } from '../album-order';
import { ItemSpaceCalculator } from '../item-space-calculator';
import { AlbumRow } from './album-row';
import { AlbumSorter } from '../../../../common/sorting/album-sorter';

@Injectable()
export class AlbumRowsGetter {
    public constructor(
        private albumSpaceCalculator: ItemSpaceCalculator,
        private albumSorter: AlbumSorter,
    ) {}

    public getAlbumRows(availableWidthInPixels: number, albums: AlbumModel[], albumOrder: AlbumOrder): AlbumRow[] {
        const albumRows: AlbumRow[] = [];

        if (albums.length === 0) {
            return albumRows;
        }

        const numberOfAlbumsPerRow: number = this.albumSpaceCalculator.calculateNumberOfItemsPerRow(
            Constants.albumSizeInPixels,
            availableWidthInPixels,
        );

        const sortedAlbums: AlbumModel[] = this.albumSorter.sortAlbums(albums, albumOrder);

        let lastYear: number = -1;
        const alreadyUsedYearHeaders: string[] = [];

        for (const album of sortedAlbums) {
            if (albumOrder === AlbumOrder.byYearAscending || albumOrder === AlbumOrder.byYearDescending) {
                album.showYear = true;

                if (
                    albumRows.length === 0 ||
                    albumRows[albumRows.length - 1].albums.length === numberOfAlbumsPerRow ||
                    album.year !== lastYear
                ) {
                    if (album.year !== lastYear) {
                        lastYear = album.year;
                    }

                    albumRows.push(new AlbumRow());
                }

                let proposedHeader: string = '?';

                if (album.year != undefined && album.year !== 0) {
                    proposedHeader = album.year.toString();
                }

                if (!alreadyUsedYearHeaders.includes(proposedHeader)) {
                    alreadyUsedYearHeaders.push(proposedHeader);
                    album.yearHeader = proposedHeader;
                } else {
                    album.yearHeader = '';
                }

                albumRows[albumRows.length - 1].albums.push(album);

                if (albumRows[albumRows.length - 1].albums[0].yearHeader.length === 0) {
                    album.showYear = false;
                }
            } else {
                album.showYear = false;

                if (albumRows.length === 0 || albumRows[albumRows.length - 1].albums.length === numberOfAlbumsPerRow) {
                    albumRows.push(new AlbumRow());
                }

                albumRows[albumRows.length - 1].albums.push(album);
            }
        }

        return albumRows;
    }
}
