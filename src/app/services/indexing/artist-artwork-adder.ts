import { Injectable } from '@angular/core';
import { ArtistArtwork } from '../../data/entities/artist-artwork';
import { Logger } from '../../common/logger';
import { ArtistArtworkCacheId } from '../artist-artwork-cache/artist-artwork-cache-id';
import { OnlineArtistArtworkGetter } from './online-artist-artwork-getter';
import { ArtistArtworkCacheServiceBase } from '../artist-artwork-cache/artist-artwork-cache.service.base';
import { ArtistArtworkRepositoryBase } from '../../data/repositories/artist-artwork-repository.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { ArrayUtils } from '../../common/utils/array-utils';

@Injectable({ providedIn: 'root' })
export class ArtistArtworkAdder {
    public constructor(
        private artistArtworkCacheService: ArtistArtworkCacheServiceBase,
        private artistArtworkRepository: ArtistArtworkRepositoryBase,
        private trackRepository: TrackRepositoryBase,
        private notificationService: NotificationServiceBase,
        private logger: Logger,
        private artistArtworkGetter: OnlineArtistArtworkGetter,
    ) {}

    public async addMissingArtistArtworkAsync(): Promise<void> {
        try {
            const allIndividualArtists: string[] = this.trackRepository.getAllIndividualArtists() ?? [];
            const allArtistArtworks: ArtistArtwork[] = this.artistArtworkRepository.getAllArtistArtwork() ?? [];
            const artistsWithArtwork: string[] = allArtistArtworks.flatMap((artistArtwork: ArtistArtwork): string => artistArtwork.artist);
            const artistsWithoutArtwork: string[] = allIndividualArtists.filter(
                (artist: string): boolean => artist !== '' && !artistsWithArtwork.includes(artist),
            );

            this.logger.info(
                `Found ${artistsWithoutArtwork.length} artists that have no artwork`,
                'ArtistArtworkAdder',
                'addMissingArtistArtworkAsync',
            );

            if (!ArrayUtils.isNullOrEmpty(artistsWithoutArtwork)) {
                await this.showNotificationTheFirstTimeIndexingRuns();
                await this.addArtistArtworkAsync(artistsWithoutArtwork);
            }
        } catch (e: unknown) {
            this.logger.error(
                e,
                'Could not add artist artwork for tracks that need artist artwork indexing',
                'ArtistArtworkAdder',
                'addMissingArtistArtworkAsync',
            );
        }
    }

    private async showNotificationTheFirstTimeIndexingRuns() {
        const numberOfArtistArtwork: number = this.artistArtworkRepository.getNumberOfArtistArtwork();
        if (numberOfArtistArtwork === 0) {
            await this.notificationService.updatingArtistArtworkAsync();
        }
    }

    private async addArtistArtworkAsync(artistsWithoutArtwork: string[]): Promise<void> {
        for (const artist of artistsWithoutArtwork) {
            try {
                const artistArtwork: Buffer | undefined = await this.artistArtworkGetter.getOnlineArtworkAsync(artist);
                if (artistArtwork != undefined) {
                    const artistArtworkCacheId: ArtistArtworkCacheId | undefined =
                        await this.artistArtworkCacheService.addArtworkDataToCacheAsync(artistArtwork);
                    if (artistArtworkCacheId != undefined) {
                        const newArtistArtwork: ArtistArtwork = new ArtistArtwork(artist, artistArtworkCacheId.id);
                        this.artistArtworkRepository.addArtistArtwork(newArtistArtwork);
                    }
                }
            } catch (e: unknown) {
                this.logger.error(e, `Could not add artist artwork for '${artist}'`, 'ArtistArtworkAdder', 'addMissingArtistArtworkAsync');
            }
        }
    }
}
