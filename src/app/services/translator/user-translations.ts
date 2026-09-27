import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, of } from 'rxjs';
import { Language } from '../../common/application/language';
import { DesktopBase } from '../../common/io/desktop.base';
import { FileAccessBase } from '../../common/io/file-access.base';

@Injectable()
export class UserTranslations implements TranslateLoader {
    private readonly bundledLoader: TranslateHttpLoader;

    public constructor(
        http: HttpClient,
        private desktop: DesktopBase,
        private fileAccess: FileAccessBase,
    ) {
        this.bundledLoader = new TranslateHttpLoader(http, './assets/i18n/', '.json');
    }

    public get directoryPath(): string {
        return this.fileAccess.combinePath([this.desktop.getApplicationDataDirectory(), 'Translations']);
    }

    public getLanguages(): Language[] {
        this.fileAccess.createFullDirectoryPathIfDoesNotExist(this.directoryPath);
        const bundledDirectory = this.desktop.getBundledTranslationsDirectory();
        if (this.fileAccess.pathExists(bundledDirectory)) {
            for (const bundledFile of this.fileAccess.getFilesInDirectory(bundledDirectory)) {
                const fileName = this.fileAccess.getFileName(bundledFile);
                if (!/^[a-zA-Z0-9-]+\.json$/.test(fileName)) {
                    continue;
                }

                const userFile = this.fileAccess.combinePath([this.directoryPath, fileName]);
                if (!this.fileAccess.pathExists(userFile)) {
                    this.fileAccess.copyFile(bundledFile, userFile);
                }
            }
        }

        return this.fileAccess.getFilesInDirectory(this.directoryPath).flatMap((filePath) => {
            const fileName = this.fileAccess.getFileName(filePath);
            if (!/^[a-zA-Z0-9-]+\.json$/.test(fileName)) {
                return [];
            }

            try {
                const translation = JSON.parse(this.fileAccess.getFileContentAsString(filePath)) as Record<string, unknown>;
                if (translation == null || typeof translation !== 'object' || Array.isArray(translation)) {
                    return [];
                }

                const code = this.fileAccess.getFileNameWithoutExtension(filePath);
                const englishName = typeof translation['language-name-english'] === 'string' ? translation['language-name-english'] : code;
                const localizedName = typeof translation['language-name-localized'] === 'string' ? translation['language-name-localized'] : englishName;
                return [new Language(code, englishName, localizedName, englishName !== localizedName)];
            } catch {
                return [];
            }
        });
    }

    public getTranslation(code: string): Observable<Object> {
        if (!/^[a-zA-Z0-9-]+$/.test(code)) {
            return this.bundledLoader.getTranslation('en');
        }

        const filePath = this.fileAccess.combinePath([this.directoryPath, `${code}.json`]);

        if (this.fileAccess.pathExists(filePath)) {
            try {
                const translation = JSON.parse(this.fileAccess.getFileContentAsString(filePath)) as Record<string, string>;
                if (translation != null && typeof translation === 'object' && !Array.isArray(translation)) {
                    return of(translation);
                }
            } catch {}
        }

        return this.bundledLoader.getTranslation(code);
    }
}