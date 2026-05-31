import { Injectable } from '@angular/core';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { ArtistArtworkAdder } from './artist-artwork-adder';
import { ArtistArtworkRemover } from './artist-artwork-remover';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { ArtistData } from '../../data/entities/artist-data';
import { ArtistsKeyGenerator } from '../../data/artists-key-generator';

@Injectable({ providedIn: 'root' })
export class ArtistArtworkIndexer {
    public constructor(
        private artistArtworkRemover: ArtistArtworkRemover,
        private artistArtworkAdder: ArtistArtworkAdder,
        private notificationService: NotificationServiceBase,
        private trackRepository: TrackRepositoryBase,
        private artistsKeyGenerator: ArtistsKeyGenerator,
        private logger: Logger,
        private settings: SettingsBase,
    ) {}

    public async indexArtistArtworkAsync(): Promise<void> {
        if (!this.settings.showArtistImages) {
            return;
        }

        this.logger.info('+++ STARTED INDEXING ARTIST ARTWORK +++', 'ArtistArtworkIndexer', 'indexArtistArtworkAsync');

        const timer: Timer = new Timer();
        timer.start();

        this.createArtistsKeysIfMissing();
        await this.artistArtworkRemover.removeArtistArtworkThatHasNoTrackAsync();
        await this.artistArtworkAdder.addMissingArtistArtworkAsync();
        await this.artistArtworkRemover.removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync();

        timer.stop();

        this.logger.info(
            `+++ FINISHED INDEXING ARTIST ARTWORK (Time required: ${timer.elapsedMilliseconds} ms) +++`,
            'ArtistArtworkIndexer',
            'indexArtistArtworkAsync',
        );

        this.notificationService.dismiss();
    }

    public async refreshMissingArtistsArtworkAsync(): Promise<void> {
        await this.notificationService.updatingArtistArtworkAsync();
        this.artistArtworkRemover.removeArtistArtworkWithDefaultIdAsync();
        await this.indexArtistArtworkAsync();
    }

    public async refreshAllArtistsArtworkAsync(): Promise<void> {
        await this.notificationService.updatingArtistArtworkAsync();
        this.artistArtworkRemover.removeAllArtistArtworkAsync();
        await this.indexArtistArtworkAsync();
    }

    private createArtistsKeysIfMissing(): void {
        const artistDatas: ArtistData[] = this.trackRepository.getArtistsWithoutArtistsKey() ?? [];
        for (const artistData of artistDatas) {
            const artists = artistData.artists;
            try {
                const artistsKey: string = this.artistsKeyGenerator.generateArtistsKey(artists);
                this.trackRepository.updateArtistsKey(artists, artistsKey);
            } catch (error) {
                this.logger.error(
                    error,
                    `Could not create ArtistsKey for '${artists}'`,
                    'ArtistArtworkIndexer',
                    'createArtistsKeysIfMissing',
                );
            }
        }
    }
}
