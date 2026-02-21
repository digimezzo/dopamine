import { Injectable } from '@angular/core';
import { Constants } from '../../../../common/application/constants';
import { Shuffler } from '../../../../common/shuffler';
import { AlbumModel } from '../../../../services/album/album-model';
import { AlbumOrder } from '../album-order';
import { ItemSpaceCalculator } from '../item-space-calculator';
import { AlbumRow } from './album-row';
import { AlbumSorter } from '../../../../common/sorting/album-sorter';
import { YearFormatter } from './year-formatter';

@Injectable()
export class AlbumRowsGetter {
    public constructor(
        private albumSpaceCalculator: ItemSpaceCalculator,
        private albumSorter: AlbumSorter,
        private shuffler: Shuffler,
    ) {}

    public getAlbumRows(
        availableWidthInPixels: number,
        albums: AlbumModel[],
        albumOrder: AlbumOrder,
        useCompactYearView: boolean,
    ): AlbumRow[] {
        const albumRows: AlbumRow[] = [];

        if (albums.length === 0) {
            return albumRows;
        }

        const numberOfAlbumsPerRow: number = this.albumSpaceCalculator.calculateNumberOfItemsPerRow(
            Constants.albumSizeInPixels,
            availableWidthInPixels,
        );

        const sortedAlbums: AlbumModel[] = this.getSortedAlbums(albums, albumOrder);

        let lastYear: number = -1;
        const alreadyUsedYearHeaders: string[] = [];

        for (const album of sortedAlbums) {
            if ((albumOrder === AlbumOrder.byYearAscending || albumOrder === AlbumOrder.byYearDescending) && !useCompactYearView) {
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

                const proposedHeader: string = YearFormatter.formatYear(album.year);

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
    private getSortedAlbums(unsortedAlbums: AlbumModel[], albumOrder: AlbumOrder): AlbumModel[] {
        let sortedAlbums: AlbumModel[] = [];

        switch (albumOrder) {
            case AlbumOrder.byAlbumTitleAscending:
                sortedAlbums = this.albumSorter.sortByAlbumTitleAscending(unsortedAlbums);
                break;
            case AlbumOrder.byAlbumTitleDescending:
                sortedAlbums = this.albumSorter.sortByAlbumTitleDescending(unsortedAlbums);
                break;
            case AlbumOrder.byDateAdded:
                sortedAlbums = this.albumSorter.sortByDateAdded(unsortedAlbums);
                break;
            case AlbumOrder.byDateCreated:
                sortedAlbums = this.albumSorter.sortByDateCreated(unsortedAlbums);
                break;
            case AlbumOrder.byAlbumArtist:
                sortedAlbums = this.albumSorter.sortByAlbumArtist(unsortedAlbums);
                break;
            case AlbumOrder.byYearAscending:
                sortedAlbums = this.albumSorter.sortByYearAscending(unsortedAlbums);
                break;
            case AlbumOrder.byYearDescending:
                sortedAlbums = this.albumSorter.sortByYearDescending(unsortedAlbums);
                break;
            case AlbumOrder.byLastPlayed:
                sortedAlbums = this.albumSorter.sortByDateLastPlayed(unsortedAlbums);
                break;
            case AlbumOrder.random:
                sortedAlbums = this.shuffler.shuffle(unsortedAlbums);
                break;
            default: {
                sortedAlbums = this.albumSorter.sortByAlbumTitleAscending(unsortedAlbums);
                break;
            }
        }

        return sortedAlbums;
    }
}
