import { Injectable } from '@angular/core';
import { Constants } from '../../../core/base/constants';
import { AlbumModel } from '../../../services/album/album-model';
import { AlbumOrder } from '../album-order';
import { AlbumRow } from './album-row';
import { AlbumSpaceCalculator } from './album-space-calculator';

@Injectable()
export class AlbumRowsGetter {
    constructor(private albumSpaceCalculator: AlbumSpaceCalculator) {}

    public getAlbumRows(availableWidthInPixels: number, albumOrder: AlbumOrder, albums: AlbumModel[]): AlbumRow[] {
        const numberOfAlbumsPerRow: number = this.albumSpaceCalculator.calculateNumberOfAlbumsPerRow(
            Constants.albumSizeInPixels,
            availableWidthInPixels
        );

        const albumRows: AlbumRow[] = [];

        let orderedAlbums: AlbumModel[] = [];

        switch (albumOrder) {
            case AlbumOrder.byAlbumTitleAscending:
                orderedAlbums = albums.sort((a, b) => (a.albumTitle > b.albumTitle ? 1 : -1));
                break;
            case AlbumOrder.byAlbumTitleDescending:
                orderedAlbums = albums.sort((a, b) => (a.albumTitle < b.albumTitle ? 1 : -1));
                break;
            case AlbumOrder.byDateAdded:
                orderedAlbums = albums.sort((a, b) => (a.dateAddedInTicks < b.dateAddedInTicks ? 1 : -1));
                break;
            case AlbumOrder.byDateCreated:
                orderedAlbums = albums.sort((a, b) => (a.dateFileCreatedInTicks < b.dateFileCreatedInTicks ? 1 : -1));
                break;
            case AlbumOrder.byAlbumArtist:
                orderedAlbums = albums.sort((a, b) => (a.albumArtist > b.albumArtist ? 1 : -1));
                break;
            case AlbumOrder.byYearAscending:
                orderedAlbums = albums.sort((a, b) => (a.year > b.year ? 1 : -1));
                break;
            case AlbumOrder.byYearDescending:
                orderedAlbums = albums.sort((a, b) => (a.year < b.year ? 1 : -1));
                break;
            case AlbumOrder.byLastPlayed:
                orderedAlbums = albums.sort((a, b) => (a.dateLastPlayedInTicks < b.dateLastPlayedInTicks ? 1 : -1));
                break;
            default: {
                orderedAlbums = albums.sort((a, b) => (a.albumTitle > b.albumTitle ? 1 : -1));
                break;
            }
        }

        let lastYear: number = -1;
        const alreadyUsedYearHeaders: string[] = [];

        for (const album of orderedAlbums) {
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

                if (!alreadyUsedYearHeaders.includes(album.year.toString())) {
                    alreadyUsedYearHeaders.push(album.year.toString());

                    if (album.year == undefined || album.year === 0) {
                        album.yearHeader = '?';
                    } else {
                        album.yearHeader = album.year.toString();
                    }
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
