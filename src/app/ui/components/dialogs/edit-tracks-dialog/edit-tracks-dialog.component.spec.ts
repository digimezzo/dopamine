import { IMock, It, Mock } from 'typemoq';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { EditTracksDialogComponent } from './edit-tracks-dialog.component';
import { TrackModel } from '../../../../services/track/track-model';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { MetadataService } from '../../../../services/metadata/metadata.service';
import { FileMetadataFactoryBase } from '../../../../common/metadata/file-metadata.factory.base';
import { Logger } from '../../../../common/logger';
import { IndexingService } from '../../../../services/indexing/indexing.service';
import { OnlineAlbumArtworkGetter } from '../../../../services/indexing/online-album-artwork-getter';
import { DesktopBase } from '../../../../common/io/desktop.base';
import { ImageProcessor } from '../../../../common/image-processor';
import { MetadataPatcher } from '../../../../common/metadata/metadata-patcher';
import { TagLibFileMetadata } from '../../../../common/metadata/tag-lib-file-metadata';
import { ImageComparisonStatus } from '../../../../services/metadata/image-comparison-status';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('EditTracksDialogComponent', () => {
    let component: EditTracksDialogComponent;

    let dialogServiceMock: IMock<DialogServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let metadataServiceMock: IMock<MetadataService>;
    let metadataPatcherMock: IMock<MetadataPatcher>;
    let indexingServiceMock: IMock<IndexingService>;
    let fileMetadataFactoryMock: IMock<FileMetadataFactoryBase>;
    let onlineAlbumArtworkGetterMock: IMock<OnlineAlbumArtworkGetter>;
    let loggerMock: IMock<Logger>;
    let desktopMock: IMock<DesktopBase>;
    let imageProcessorMock: IMock<ImageProcessor>;
    let dataMock: TrackModel[];

    beforeEach(() => {
        dataMock = [];
        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        metadataServiceMock = Mock.ofType<MetadataService>();
        metadataPatcherMock = Mock.ofType<MetadataPatcher>();
        indexingServiceMock = Mock.ofType<IndexingService>();
        fileMetadataFactoryMock = Mock.ofType<FileMetadataFactoryBase>();
        onlineAlbumArtworkGetterMock = Mock.ofType<OnlineAlbumArtworkGetter>();
        loggerMock = Mock.ofType<Logger>();
        desktopMock = Mock.ofType<DesktopBase>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();

        component = new EditTracksDialogComponent(
            dialogServiceMock.object,
            translatorServiceMock.object,
            metadataServiceMock.object,
            metadataPatcherMock.object,
            indexingServiceMock.object,
            fileMetadataFactoryMock.object,
            onlineAlbumArtworkGetterMock.object,
            loggerMock.object,
            desktopMock.object,
            imageProcessorMock.object,
            dataMock,
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('selection message', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [EditTracksDialogComponent],
                imports: [CommonModule, FormsModule, TranslateModule.forRoot()],
                providers: [
                    { provide: DialogServiceBase, useValue: dialogServiceMock.object },
                    { provide: TranslatorServiceBase, useValue: translatorServiceMock.object },
                    { provide: MetadataService, useValue: metadataServiceMock.object },
                    { provide: MetadataPatcher, useValue: metadataPatcherMock.object },
                    { provide: IndexingService, useValue: indexingServiceMock.object },
                    { provide: FileMetadataFactoryBase, useValue: fileMetadataFactoryMock.object },
                    { provide: OnlineAlbumArtworkGetter, useValue: onlineAlbumArtworkGetterMock.object },
                    { provide: Logger, useValue: loggerMock.object },
                    { provide: DesktopBase, useValue: desktopMock.object },
                    { provide: ImageProcessor, useValue: imageProcessorMock.object },
                    { provide: MAT_DIALOG_DATA, useValue: dataMock },
                ],
                schemas: [NO_ERRORS_SCHEMA],
            });
            const translations = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../../../assets/i18n/en.json'), 'utf-8'));
            const translate = TestBed.inject(TranslateService);
            translate.setTranslation('en', translations);
            translate.use('en');
            translatorServiceMock.setup((x) => x.getAsync(It.isAny())).returns(() => Promise.resolve('Multiple values'));
            metadataServiceMock.setup((x) => x.compareImages(It.isAny())).returns(() => ImageComparisonStatus.None);
            metadataServiceMock.setup((x) => x.createTrackImageUrlAsync(It.isAny())).returns(() => Promise.resolve(''));
            metadataPatcherMock
                .setup((x) => x.joinUnsplittableMetadata(It.isAny()))
                .returns((values) => new MetadataPatcher().joinUnsplittableMetadata(values));
        });

        it.each([1, 2, 42])('shows the selected count only for multiple songs (%i selected)', async (count) => {
            for (let i = 0; i < count; i++) {
                const track = Mock.ofType<TrackModel>();
                const trackPath = `track-${i}`;
                track.setup((x) => x.path).returns(() => trackPath);
                dataMock.push(track.object);
                fileMetadataFactoryMock
                    .setup((x) => x.createAsync(trackPath))
                    .returns(() => Promise.resolve(new TagLibFileMetadata(trackPath)));
            }
            const fixture = TestBed.createComponent(EditTracksDialogComponent);

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const message = fixture.nativeElement.querySelector('.edit-tracks__selection-message');
            if (count > 1) {
                expect(message.textContent.trim()).toBe(
                    `You selected ${count} songs. The changes will affect all selected songs.`,
                );
            } else {
                expect(message).toBeNull();
            }
        });

        it('counts selected songs even when reading a song fails', async () => {
            for (const trackPath of ['first', 'second']) {
                const track = Mock.ofType<TrackModel>();
                track.setup((x) => x.path).returns(() => trackPath);
                dataMock.push(track.object);
            }
            fileMetadataFactoryMock.setup((x) => x.createAsync('first')).returns(() => Promise.reject(new Error('Read failed')));
            fileMetadataFactoryMock
                .setup((x) => x.createAsync('second'))
                .returns(() => Promise.resolve(new TagLibFileMetadata('second')));
            const fixture = TestBed.createComponent(EditTracksDialogComponent);

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('.edit-tracks__selection-message').textContent.trim()).toBe(
                'You selected 2 songs. The changes will affect all selected songs.',
            );
        });
    });

    describe('editing metadata', () => {
        const multipleValues = 'Multiple values';
        const arrayFields = ['artists', 'albumArtists', 'genres', 'composers'] as const;
        const numberFields = ['year', 'trackNumber', 'trackCount', 'discNumber', 'discCount', 'beatsPerMinute'] as const;

        async function initialize(metadata: TagLibFileMetadata[]): Promise<void> {
            for (const item of metadata) {
                const track = Mock.ofType<TrackModel>();
                track.setup((x) => x.path).returns(() => item.path);
                dataMock.push(track.object);
                fileMetadataFactoryMock.setup((x) => x.createAsync(item.path)).returns(() => Promise.resolve(item));
                jest.spyOn(item, 'save').mockImplementation(() => {});
            }

            translatorServiceMock.setup((x) => x.getAsync(It.isAny())).returns(() => Promise.resolve(multipleValues));
            metadataServiceMock.setup((x) => x.compareImages(It.isAny())).returns(() => ImageComparisonStatus.None);
            metadataServiceMock.setup((x) => x.createTrackImageUrlAsync(It.isAny())).returns(() => Promise.resolve(''));
            metadataPatcherMock
                .setup((x) => x.joinUnsplittableMetadata(It.isAny()))
                .returns((values) => new MetadataPatcher().joinUnsplittableMetadata(values));
            indexingServiceMock.setup((x) => x.indexAfterTagChangeAsync(It.isAny())).returns(() => Promise.resolve());

            await component.ngOnInit();
        }

        it('displays equal array values for independently loaded tracks', async () => {
            const first = new TagLibFileMetadata('first');
            const second = new TagLibFileMetadata('second');
            for (const field of arrayFields) {
                first[field] = ['One', 'Two'];
                second[field] = ['One', 'Two'];
            }

            await initialize([first, second]);

            for (const field of arrayFields) {
                expect(component[field]).toBe('One;Two');
            }
        });

        it('displays blank for empty arrays and applies the same metadata patching as single-track editing', async () => {
            const first = new TagLibFileMetadata('first');
            const second = new TagLibFileMetadata('second');
            first.artists = ['AC', 'DC'];
            second.artists = ['AC', 'DC'];

            await initialize([first, second]);

            expect(component.artists).toBe('AC/DC');
            expect(component.albumArtists).toBe('');
            expect(component.genres).toBe('');
            expect(component.composers).toBe('');
        });

        it.each(arrayFields)('preserves differing %s values when saving', async (field) => {
            const first = new TagLibFileMetadata('first');
            const second = new TagLibFileMetadata('second');
            first[field] = ['One', 'Two'];
            second[field] = ['One', 'Other'];

            await initialize([first, second]);
            expect(component[field]).toBe(multipleValues);
            await component.saveMetadataAsync();

            expect(first[field]).toEqual(['One', 'Two']);
            expect(second[field]).toEqual(['One', 'Other']);
            expect(first.save).toHaveBeenCalledTimes(1);
            expect(second.save).toHaveBeenCalledTimes(1);
        });

        it.each(arrayFields)('detects different lengths in %s', async (field) => {
            const first = new TagLibFileMetadata('first');
            const second = new TagLibFileMetadata('second');
            first[field] = ['One', 'Two'];
            second[field] = ['One'];
            await initialize([first, second]);
            expect(component[field]).toBe(multipleValues);
        });

        it('displays blank numeric fields as blank for multiple tracks', async () => {
            const first = new TagLibFileMetadata('first');
            const second = new TagLibFileMetadata('second');
            await initialize([first, second]);

            for (const field of numberFields) {
                expect(component[field]).toBe('');
            }
            await component.saveMetadataAsync();
            for (const field of numberFields) {
                expect(first[field]).toBe(0);
                expect(second[field]).toBe(0);
            }
        });

        it('preserves single-track formatting', async () => {
            const metadata = new TagLibFileMetadata('first');
            metadata.artists = ['AC', 'DC'];
            metadata.trackCount = 12;

            await initialize([metadata]);

            expect(component.artists).toBe('AC/DC');
            expect(component.trackCount).toBe('12');
            expect(component.beatsPerMinute).toBe('');
        });

        it.each(arrayFields)('detects different ordering in %s', async (field) => {
            const first = new TagLibFileMetadata('first');
            const second = new TagLibFileMetadata('second');
            first[field] = ['One', 'Two'];
            second[field] = ['Two', 'One'];
            await initialize([first, second]);
            expect(component[field]).toBe(multipleValues);
        });

        it.each(numberFields)('displays shared %s values correctly', async (field) => {
            const first = new TagLibFileMetadata('first');
            const second = new TagLibFileMetadata('second');
            first[field] = 123;
            second[field] = 123;
            await initialize([first, second]);
            expect(component[field]).toBe('123');
        });

        it.each(numberFields)('preserves differing %s values when saving', async (field) => {
            const first = new TagLibFileMetadata('first');
            const second = new TagLibFileMetadata('second');
            first[field] = 0;
            second[field] = 123;
            await initialize([first, second]);
            expect(component[field]).toBe(multipleValues);
            await component.saveMetadataAsync();
            expect(first[field]).toBe(0);
            expect(second[field]).toBe(123);
        });

        it('preserves differing track counts when disc counts match', async () => {
            const first = new TagLibFileMetadata('first');
            const second = new TagLibFileMetadata('second');
            first.trackCount = 12;
            second.trackCount = 13;
            first.discCount = second.discCount = 1;
            await initialize([first, second]);

            expect(component.trackCount).toBe(multipleValues);
            expect(component.discCount).toBe('1');
            await component.saveMetadataAsync();
            expect(first.trackCount).toBe(12);
            expect(second.trackCount).toBe(13);
        });

        it('displays shared track counts independently of differing disc counts', async () => {
            const first = new TagLibFileMetadata('first');
            const second = new TagLibFileMetadata('second');
            first.trackCount = second.trackCount = 12;
            first.discCount = 1;
            second.discCount = 2;
            await initialize([first, second]);

            expect(component.trackCount).toBe('12');
            expect(component.discCount).toBe(multipleValues);
            await component.saveMetadataAsync();
            expect(first.trackCount).toBe(12);
            expect(second.trackCount).toBe(12);
            expect(first.discCount).toBe(1);
            expect(second.discCount).toBe(2);
        });

        it('saves edited array fields and displays the shared values when reopened', async () => {
            const first = new TagLibFileMetadata('first');
            const second = new TagLibFileMetadata('second');
            for (const field of arrayFields) {
                first[field] = ['First'];
                second[field] = ['Second'];
            }
            await initialize([first, second]);
            for (const field of arrayFields) {
                component[field] = 'Shared;Other';
            }
            await component.saveMetadataAsync();

            component = new EditTracksDialogComponent(
                dialogServiceMock.object,
                translatorServiceMock.object,
                metadataServiceMock.object,
                metadataPatcherMock.object,
                indexingServiceMock.object,
                fileMetadataFactoryMock.object,
                onlineAlbumArtworkGetterMock.object,
                loggerMock.object,
                desktopMock.object,
                imageProcessorMock.object,
                dataMock,
            );
            await component.ngOnInit();
            for (const field of arrayFields) {
                expect(first[field]).toEqual(['Shared', 'Other']);
                expect(second[field]).toEqual(['Shared', 'Other']);
                expect(component[field]).toBe('Shared;Other');
            }
        });
    });
});
