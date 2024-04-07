import { Injectable } from '@angular/core';
import { Sorter } from './sorter';
import { AlbumModel } from '../../services/album/album-model';

@Injectable({ providedIn: 'root' })
export class AlbumSorter {
    public sortByAlbumTitleAscending(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        return albums.sort((a, b) => Sorter.naturalSort(a.albumTitle.toLowerCase(), b.albumTitle.toLowerCase()));
    }

    public sortByAlbumTitleDescending(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        return albums.sort((a, b) => Sorter.naturalSort(b.albumTitle.toLowerCase(), a.albumTitle.toLowerCase()));
    }

    public sortByDateAdded(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        return albums.sort((a, b) => (a.dateAddedInTicks < b.dateAddedInTicks ? 1 : -1));
    }

    public sortByDateCreated(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        return albums.sort((a, b) => (a.dateFileCreatedInTicks < b.dateFileCreatedInTicks ? 1 : -1));
    }

    public sortByAlbumArtist(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        return albums.sort((a, b) => Sorter.naturalSort(a.albumArtist.toLowerCase(), b.albumArtist.toLowerCase()));
    }

    public sortByYearAscending(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        return albums.sort((a, b) => (a.year > b.year ? 1 : -1));
    }

    public sortByYearDescending(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        return albums.sort((a, b) => (a.year < b.year ? 1 : -1));
    }

    public sortByDateLastPlayed(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        return albums.sort((a, b) => (a.dateLastPlayedInTicks < b.dateLastPlayedInTicks ? 1 : -1));
    }
}
