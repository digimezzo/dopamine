import { HttpClient } from '@angular/common/http';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { of } from 'rxjs';
import { DesktopBase } from '../../common/io/desktop.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { UserTranslations } from './user-translations';

describe('UserTranslations', () => {
    let applicationDirectory: string;
    let bundledDirectory: string;
    let translations: UserTranslations;
    let http: { get: jest.Mock };

    beforeEach(() => {
        applicationDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'dopamine-translations-'));
        bundledDirectory = path.join(applicationDirectory, 'bundled');
        fs.mkdirSync(bundledDirectory);
        http = { get: jest.fn().mockReturnValue(of({ hello: 'bundled' })) };
        const desktop = {
            getApplicationDataDirectory: () => applicationDirectory,
            getBundledTranslationsDirectory: () => bundledDirectory,
        } as DesktopBase;
        const fileAccess = {
            combinePath: (pieces: string[]) => path.join(...pieces),
            createFullDirectoryPathIfDoesNotExist: (directory: string) => fs.mkdirSync(directory, { recursive: true }),
            getFilesInDirectory: (directory: string) =>
                fs.readdirSync(directory).map((file) => path.join(directory, file)).filter((file) => fs.statSync(file).isFile()),
            getFileName: (file: string) => path.basename(file),
            getFileNameWithoutExtension: (file: string) => path.basename(file, path.extname(file)),
            getFileContentAsString: (file: string) => fs.readFileSync(file, 'utf8'),
            pathExists: (file: string) => fs.existsSync(file),
            copyFile: (source: string, destination: string) => fs.copyFileSync(source, destination),
        } as FileAccessBase;
        translations = new UserTranslations(http as unknown as HttpClient, desktop, fileAccess);
    });

    afterEach(() => {
        fs.rmSync(applicationDirectory, { recursive: true, force: true });
    });

    it('creates the translations directory and discovers JSON language names', () => {
        expect(translations.getLanguages()).toEqual([]);
        expect(fs.existsSync(translations.directoryPath)).toBe(true);

        fs.writeFileSync(
            path.join(translations.directoryPath, 'xx.json'),
            JSON.stringify({ 'language-name-english': 'Test language', 'language-name-localized': 'Local name', hello: 'custom' }),
        );
        fs.writeFileSync(path.join(translations.directoryPath, 'notes.txt'), 'not a translation');

        expect(translations.getLanguages()).toEqual([
            expect.objectContaining({ code: 'xx', englishName: 'Test language', localizedName: 'Local name', showEnglishName: true }),
        ]);
    });

    it('copies missing bundled translations and preserves edits to user files', () => {
        const english = JSON.stringify({ 'language-name-english': 'English', 'language-name-localized': 'English', hello: 'bundled' });
        fs.writeFileSync(path.join(bundledDirectory, 'en.json'), english);
        fs.writeFileSync(path.join(bundledDirectory, 'de.json'), JSON.stringify({ 'language-name-english': 'German', hello: 'Hallo' }));
        fs.writeFileSync(path.join(bundledDirectory, 'notes.txt'), 'not a translation');

        expect(translations.getLanguages().map((language) => language.code)).toEqual(['de', 'en']);
        const englishUserFile = path.join(translations.directoryPath, 'en.json');
        expect(fs.readFileSync(englishUserFile, 'utf8')).toBe(english);
        expect(fs.existsSync(path.join(translations.directoryPath, 'notes.txt'))).toBe(false);

        fs.writeFileSync(englishUserFile, JSON.stringify({ hello: 'my edits' }));
        fs.unlinkSync(path.join(translations.directoryPath, 'de.json'));
        translations.getLanguages();

        expect(fs.readFileSync(englishUserFile, 'utf8')).toBe(JSON.stringify({ hello: 'my edits' }));
        expect(fs.existsSync(path.join(translations.directoryPath, 'de.json'))).toBe(true);
    });

    it('loads user JSON instead of a bundled language with the same code', async () => {
        translations.getLanguages();
        fs.writeFileSync(path.join(translations.directoryPath, 'en.json'), JSON.stringify({ hello: 'custom' }));

        expect(await translations.getTranslation('en').toPromise()).toEqual({ hello: 'custom' });
        expect(http.get).not.toHaveBeenCalled();
    });

    it('ignores malformed files and falls back to bundled translations', async () => {
        translations.getLanguages();
        fs.writeFileSync(path.join(translations.directoryPath, 'en.json'), '{broken');

        expect(translations.getLanguages()).toEqual([]);
        expect(await translations.getTranslation('en').toPromise()).toEqual({ hello: 'bundled' });
        expect(http.get).toHaveBeenCalledWith('./assets/i18n/en.json');
    });
});