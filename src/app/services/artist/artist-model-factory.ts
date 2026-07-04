import { Injectable } from '@angular/core';
import { ArtistModel } from './artist-model';
import { ApplicationPaths } from '../../common/application/application-paths';
import { TranslatorServiceBase } from '../translator/translator.service.base';

@Injectable()
export class ArtistModelFactory {
    public constructor(
        private translatorService: TranslatorServiceBase,
        private applicationPaths: ApplicationPaths,
    ) {}

    public create(artistName: string, artworkId?: string | undefined): ArtistModel {
        return new ArtistModel(artistName, artworkId, this.translatorService, this.applicationPaths);
    }
}