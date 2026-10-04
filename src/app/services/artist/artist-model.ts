import { SemanticZoomable } from '../../common/semantic-zoomable';
import { StringUtils } from '../../common/utils/string-utils';
import { ISelectable } from '../../ui/interfaces/i-selectable';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { Constants } from '../../common/application/constants';
import { ApplicationPaths } from '../../common/application/application-paths';
import { ArtistArtworkCacheId } from '../artist-artwork-cache/artist-artwork-cache-id';

export class ArtistModel extends SemanticZoomable implements ISelectable {
    private readonly sortableStringGetter: (name: string | undefined) => string;

    public constructor(
        public name: string,
        public artworkId: string | undefined,
        private translatorService: TranslatorServiceBase,
        private applicationPaths: ApplicationPaths,
        ignoredPrefixes: string[] | ((name: string | undefined) => string) = [],
    ) {
        super();
        this.sortableStringGetter =
            typeof ignoredPrefixes === 'function' ? ignoredPrefixes : StringUtils.createSortableStringGetter(ignoredPrefixes);
    }

    public isSelected: boolean = false;

    public get sortableName(): string {
        if (this.isUnknownArtist || this.isZoomHeader) {
            return super.sortableName;
        }

        return this.sortableStringGetter(this.displayName);
    }

    public get displayName(): string {
        if (this.isUnknownArtist) {
            return this.translatorService.get(Constants.unknownArtist);
        }

        return this.name;
    }

    public get isUnknownArtist(): boolean {
        return StringUtils.isNullOrWhiteSpace(this.name);
    }

    public get artworkPath(): string {
        if (
            this.isUnknownArtist ||
            StringUtils.isNullOrWhiteSpace(this.artworkId) ||
            this.artworkId === ArtistArtworkCacheId.defaultArtworkId
        ) {
            return Constants.emptyImage;
        }

        return 'file:///' + this.applicationPaths.artistArtFullPath(this.artworkId!);
    }
}
