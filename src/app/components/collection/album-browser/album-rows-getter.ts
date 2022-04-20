import { Injectable } from '@angular/core';
import { Constants } from '../../../common/application/constants';
import { Shuffler } from '../../../common/shuffler';
import { AlbumModel } from '../../../services/album/album-model';
import { AlbumOrder } from '../album-order';
import { ItemSpaceCalculator } from '../item-space-calculator';
import { AlbumRow } from './album-row';

@Injectable()
export class AlbumRowsGetter {
    constructor(private albumSpaceCalculator: ItemSpaceCalculator, private shuffler: Shuffler) {}

    public getAlbumRows(availableWidthInPixels: number, albums: AlbumModel[], albumOrder: AlbumOrder): AlbumRow[] {
        const albumRows: AlbumRow[] = [];

        if (albums == undefined) {
            return albumRows;
        }

        if (albums.length === 0) {
            return albumRows;
        }

        const numberOfAlbumsPerRow: number = this.albumSpaceCalculator.calculateNumberOfItemsPerRow(
            Constants.albumSizeInPixels,
            availableWidthInPixels
        );

        const sortedAlbums: AlbumModel[] = this.getSortedAlbums(albums, albumOrder);

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
    private getSortedAlbums(unsortedAlbums: AlbumModel[], albumOrder: AlbumOrder): AlbumModel[] {
        let sortedAlbums: AlbumModel[] = [];

        switch (albumOrder) {
            case AlbumOrder.byAlbumTitleAscending:
                sortedAlbums = unsortedAlbums.sort((a, b) => (a.albumTitle.toLowerCase() > b.albumTitle.toLowerCase() ? 1 : -1));
                break;
            case AlbumOrder.byAlbumTitleDescending:
                sortedAlbums = unsortedAlbums.sort((a, b) => (a.albumTitle.toLowerCase() < b.albumTitle.toLowerCase() ? 1 : -1));
                break;
            case AlbumOrder.byDateAdded:
                sortedAlbums = unsortedAlbums.sort((a, b) => (a.dateAddedInTicks < b.dateAddedInTicks ? 1 : -1));
                break;
            case AlbumOrder.byDateCreated:
                sortedAlbums = unsortedAlbums.sort((a, b) => (a.dateFileCreatedInTicks < b.dateFileCreatedInTicks ? 1 : -1));
                break;
            case AlbumOrder.byAlbumArtist:
                sortedAlbums = unsortedAlbums.sort((a, b) => (a.albumArtist.toLowerCase() > b.albumArtist.toLowerCase() ? 1 : -1));
                break;
            case AlbumOrder.byYearAscending:
                sortedAlbums = unsortedAlbums.sort((a, b) => (a.year > b.year ? 1 : -1));
                break;
            case AlbumOrder.byYearDescending:
                sortedAlbums = unsortedAlbums.sort((a, b) => (a.year < b.year ? 1 : -1));
                break;
            case AlbumOrder.byLastPlayed:
                sortedAlbums = unsortedAlbums.sort((a, b) => (a.dateLastPlayedInTicks < b.dateLastPlayedInTicks ? 1 : -1));
                break;
            case AlbumOrder.random:
                sortedAlbums = this.shuffler.shuffle(unsortedAlbums);
                break;
            default: {
                sortedAlbums = unsortedAlbums.sort((a, b) => (a.albumTitle.toLowerCase() > b.albumTitle.toLowerCase() ? 1 : -1));
                break;
            }
        }

        return sortedAlbums;
    }
}
