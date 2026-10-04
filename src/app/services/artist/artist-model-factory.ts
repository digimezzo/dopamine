import { Injectable } from '@angular/core';
import { ArtistModel } from './artist-model';
import { ApplicationPaths } from '../../common/application/application-paths';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { CollectionUtils } from '../../common/utils/collections-utils';
import { StringUtils } from '../../common/utils/string-utils';

@Injectable()
export class ArtistModelFactory {
    private cachedPrefixSetting: string | undefined;
    private sortableStringGetter = StringUtils.createSortableStringGetter([]);

    public constructor(
        private translatorService: TranslatorServiceBase,
        private applicationPaths: ApplicationPaths,
        private settings: SettingsBase,
    ) {}

    public create(artistName: string, artworkId?: string | undefined): ArtistModel {
        const prefixSetting = this.settings.sortPrefixes;
        if (prefixSetting !== this.cachedPrefixSetting) {
            this.sortableStringGetter = StringUtils.createSortableStringGetter(CollectionUtils.fromString(prefixSetting));
            this.cachedPrefixSetting = prefixSetting;
        }

        return new ArtistModel(
            artistName,
            artworkId,
            this.translatorService,
            this.applicationPaths,
            this.sortableStringGetter,
        );
    }
}