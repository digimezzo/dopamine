import { Injectable } from '@angular/core';
import { FileAccessBase } from '../../common/io/file-access.base';
import { DesktopBase } from '../../common/io/desktop.base';
import { Logger } from '../../common/logger';
import { StringUtils } from '../../common/utils/string-utils';
import { TrackModel } from '../track/track-model';
import { Track } from '../../data/entities/track';
import { DataDelimiter } from '../../data/data-delimiter';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';

interface RatingBackup {
    version: number;
    lastBackupDate: number;
    ratings: RatingEntry[];
}

interface RatingEntry {
    trackPath: string;
    rating: number;
    love: number;
    artist?: string; // Legacy/primary artist fallback for matching if path changes
    artists?: string[]; // Full artist list for robust multi-artist matching
    title?: string; // Fallback for matching if path changes
}

interface AutoRestoreSafetyDiagnostics {
    isSafe: boolean;
    reason: string;
    tracksWithDbState: number;
    maxSafeExistingState: number;
    confidentlyMatchableMissingTracks: number;
    minimumExpectedMatches: number;
    meaningfulEntriesCount: number;
    tracksCount: number;
}

@Injectable({
    providedIn: 'root',
})
export class RatingBackupService {
    private _ratingsBackupPath: string = '';
    private _ratingsDirectoryPath: string = '';
    private _backupFileName: string = 'ratings-backup.json';
    private _autoRestoreGuardFileName: string = 'auto-restore-v1.done';
    private _autoRestoreGuardPath: string = '';
    private _backupVersion: number = 1;

    public constructor(
        private fileAccess: FileAccessBase,
        private desktop: DesktopBase,
        private logger: Logger,
        private trackRepository: TrackRepositoryBase,
    ) {
        this.initialize();
    }

    public get ratingsBackupPath(): string {
        return this._ratingsBackupPath;
    }

    public get ratingsDirectoryPath(): string {
        return this._ratingsDirectoryPath;
    }

    private initialize(): void {
        let musicDirectory: string = '';

        try {
            musicDirectory = this.desktop.getMusicDirectory();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not access music directory', 'RatingBackupService', 'initialize');
        }

        const hasMusicDirectory = !StringUtils.isNullOrWhiteSpace(musicDirectory) && this.fileAccess.pathExists(musicDirectory);
        const baseDirectory = hasMusicDirectory ? musicDirectory : this.desktop.getApplicationDataDirectory();
        this._ratingsDirectoryPath = this.getRatingsDirectoryPath(baseDirectory, hasMusicDirectory);
        this._ratingsBackupPath = this.fileAccess.combinePath([this._ratingsDirectoryPath, this._backupFileName]);
        this._autoRestoreGuardPath = this.fileAccess.combinePath([this._ratingsDirectoryPath, this._autoRestoreGuardFileName]);

        if (hasMusicDirectory) {
            this.logger.info(
                `Music directory found at '${musicDirectory}'. Saving ratings backup to '${this._ratingsBackupPath}'`,
                'RatingBackupService',
                'initialize',
            );
        } else {
            this.logger.info(
                `Music directory not found. Saving ratings backup to '${this._ratingsBackupPath}'`,
                'RatingBackupService',
                'initialize',
            );
        }
    }

    private getRatingsDirectoryPath(baseDirectory: string, useMusicDirectoryLayout: boolean): string {
        if (useMusicDirectoryLayout) {
            return this.fileAccess.combinePath([baseDirectory, 'Dopamine', 'Ratings']);
        }

        return this.fileAccess.combinePath([baseDirectory, 'Ratings']);
    }

    public backupTrackRatingAsync(track: TrackModel): Promise<void> {
        return this.upsertBackupEntryAsync(track, 'rating');
    }

    public backupTrackLoveAsync(track: TrackModel): Promise<void> {
        return this.upsertBackupEntryAsync(track, 'love');
    }

    private upsertBackupEntryAsync(track: TrackModel, source: 'rating' | 'love'): Promise<void> {
        try {
            // Ensure the ratings directory exists
            this.fileAccess.createFullDirectoryPathIfDoesNotExist(this._ratingsDirectoryPath);

            // Load existing backup or create a new one
            const backup: RatingBackup = this.loadBackup();

            // Update or add the rating entry
            const existingIndex = backup.ratings.findIndex((r) => r.trackPath === track.path);
            const existingEntry = existingIndex >= 0 ? backup.ratings[existingIndex] : undefined;
            const nextRating = source === 'rating' ? track.rating : (existingEntry?.rating ?? 0);
            const nextLove = source === 'love' ? track.love : (existingEntry?.love ?? 0);

            // Keep backup focused on recoverable state only.
            if (!this.hasMeaningfulState(nextRating, nextLove)) {
                if (existingIndex >= 0) {
                    backup.ratings.splice(existingIndex, 1);
                }
            } else if (existingIndex >= 0) {
                backup.ratings[existingIndex] = {
                    trackPath: track.path,
                    rating: nextRating,
                    love: nextLove,
                    artist: this.getPrimaryArtistFromModel(track),
                    artists: this.getArtistsFromModel(track),
                    title: track.title,
                };
            } else {
                backup.ratings.push({
                    trackPath: track.path,
                    rating: nextRating,
                    love: nextLove,
                    artist: this.getPrimaryArtistFromModel(track),
                    artists: this.getArtistsFromModel(track),
                    title: track.title,
                });
            }

            // Update backup metadata
            backup.lastBackupDate = Date.now();

            // Write the backup file
            this.fileAccess.writeToFile(this._ratingsBackupPath, JSON.stringify(backup, undefined, 2));
            this.logger.info(
                `Backed up ${source} for track '${track.path}'`,
                'RatingBackupService',
                source === 'rating' ? 'backupTrackRatingAsync' : 'backupTrackLoveAsync',
            );
        } catch (e: unknown) {
            this.logger.error(
                e,
                source === 'rating' ? 'Could not backup track rating' : 'Could not backup track love',
                'RatingBackupService',
                source === 'rating' ? 'backupTrackRatingAsync' : 'backupTrackLoveAsync',
            );
        }

        return Promise.resolve();
    }

    public restoreRatingsManuallyAsync(): Promise<number> {
        try {
            const tracks = this.trackRepository.getVisibleTracks() ?? [];

            if (tracks.length === 0) {
                this.logger.info('No tracks found, skipping manual restore', 'RatingBackupService', 'restoreRatingsManuallyAsync');
                return Promise.resolve(0);
            }

            const backup: RatingBackup = this.loadBackup();

            const meaningfulEntries = this.getMeaningfulEntries(backup.ratings);

            if (meaningfulEntries.length === 0) {
                this.logger.info('No backup entries found, skipping manual restore', 'RatingBackupService', 'restoreRatingsManuallyAsync');
                return Promise.resolve(0);
            }

            const restoredCount = this.restoreMissingRatingsFromBackup(tracks, meaningfulEntries);

            this.logger.info(
                `Manual restore completed, restored ${restoredCount} track ratings`,
                'RatingBackupService',
                'restoreRatingsManuallyAsync',
            );

            return Promise.resolve(restoredCount);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not manually restore ratings', 'RatingBackupService', 'restoreRatingsManuallyAsync');
            return Promise.resolve(0);
        }
    }

    public async tryAutoRestoreOnStartupAsync(tracks: Track[]): Promise<number> {
        try {
            if (this.fileAccess.pathExists(this._autoRestoreGuardPath)) {
                return 0;
            }

            if (tracks.length === 0) {
                return 0;
            }

            const backup: RatingBackup = this.loadBackup();

            const meaningfulEntries = this.getMeaningfulEntries(backup.ratings);

            if (meaningfulEntries.length === 0) {
                return 0;
            }

            const diagnostics = this.getAutoRestoreSafetyDiagnostics(tracks, meaningfulEntries);

            if (!diagnostics.isSafe) {
                this.logger.info(
                    `Skipped auto-restore: ${diagnostics.reason}. Details: tracksWithDbState=${diagnostics.tracksWithDbState}, maxSafeExistingState=${diagnostics.maxSafeExistingState}, confidentlyMatchableMissingTracks=${diagnostics.confidentlyMatchableMissingTracks}, minimumExpectedMatches=${diagnostics.minimumExpectedMatches}, meaningfulEntries=${diagnostics.meaningfulEntriesCount}, tracks=${diagnostics.tracksCount}`,
                    'RatingBackupService',
                    'tryAutoRestoreOnStartupAsync',
                );
                this.markAutoRestoreAttempted();
                return 0;
            }

            const restoredCount = this.restoreMissingRatingsFromBackup(tracks, meaningfulEntries);
            this.markAutoRestoreAttempted();

            this.logger.info(
                `Auto-restore completed, restored ${restoredCount} track ratings`,
                'RatingBackupService',
                'tryAutoRestoreOnStartupAsync',
            );

            return restoredCount;
        } catch (e: unknown) {
            this.logger.error(e, 'Could not auto-restore ratings on startup', 'RatingBackupService', 'tryAutoRestoreOnStartupAsync');
            return 0;
        }
    }

    public loadBackup(): RatingBackup {
        try {
            if (this.fileAccess.pathExists(this._ratingsBackupPath)) {
                const fileContent = this.fileAccess.getFileContentAsString(this._ratingsBackupPath);
                const parsedBackup = JSON.parse(fileContent) as Partial<RatingBackup>;
                const backup: RatingBackup = {
                    version: parsedBackup.version ?? this._backupVersion,
                    lastBackupDate: parsedBackup.lastBackupDate ?? 0,
                    ratings: Array.isArray(parsedBackup.ratings) ? parsedBackup.ratings : [],
                };

                const meaningfulEntries = this.getMeaningfulEntries(backup.ratings);

                // One-time cleanup: drop legacy zero-only rows and persist immediately.
                if (meaningfulEntries.length !== backup.ratings.length) {
                    const sanitizedBackup: RatingBackup = {
                        version: backup.version,
                        lastBackupDate: Date.now(),
                        ratings: meaningfulEntries,
                    };

                    try {
                        this.fileAccess.writeToFile(this._ratingsBackupPath, JSON.stringify(sanitizedBackup, undefined, 2));
                    } catch (writeError: unknown) {
                        this.logger.error(
                            writeError,
                            'Could not persist cleaned ratings backup; continuing with in-memory cleaned backup',
                            'RatingBackupService',
                            'loadBackup',
                        );
                    }

                    this.logger.info(
                        `Cleaned ratings backup from ${backup.ratings.length} to ${meaningfulEntries.length} entries`,
                        'RatingBackupService',
                        'loadBackup',
                    );

                    return sanitizedBackup;
                }

                this.logger.info(`Loaded ratings backup with ${backup.ratings.length} entries`, 'RatingBackupService', 'loadBackup');
                return backup;
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not load ratings backup', 'RatingBackupService', 'loadBackup');
        }

        // Return a new empty backup if loading fails or file doesn't exist
        return this.createEmptyBackup();
    }

    private createEmptyBackup(): RatingBackup {
        return {
            version: this._backupVersion,
            lastBackupDate: 0,
            ratings: [],
        };
    }

    /**
     * Creates an initial backup from existing rated tracks in the database.
     * This should be called once during app initialization for users upgrading from before the backup feature.
     * Does nothing if backup file already exists.
     * @param tracksWithRatings - Array of Track entities with ratings
     */
    public createInitialBackupFromTracksAsync(tracksWithRatings: Track[]): Promise<void> {
        try {
            // Don't overwrite existing backup
            if (this.fileAccess.pathExists(this._ratingsBackupPath)) {
                this.logger.info(
                    'Backup file already exists, skipping initial backup creation',
                    'RatingBackupService',
                    'createInitialBackupFromTracksAsync',
                );
                return Promise.resolve();
            }

            // Filter to only tracks with meaningful recoverable state.
            const ratedTracks = tracksWithRatings.filter((track) => this.hasMeaningfulState(track.rating, track.love));

            if (ratedTracks.length === 0) {
                this.logger.info(
                    'No rated tracks found, skipping initial backup creation',
                    'RatingBackupService',
                    'createInitialBackupFromTracksAsync',
                );
                return Promise.resolve();
            }

            // Create rating entries from tracks
            const ratingEntries: RatingEntry[] = ratedTracks.map((track) => this.createEntryFromTrack(track));

            // Create and save backup
            const backup: RatingBackup = {
                version: this._backupVersion,
                lastBackupDate: Date.now(),
                ratings: ratingEntries,
            };

            this.fileAccess.createFullDirectoryPathIfDoesNotExist(this._ratingsDirectoryPath);
            this.fileAccess.writeToFile(this._ratingsBackupPath, JSON.stringify(backup, undefined, 2));

            this.logger.info(
                `Created initial backup with ${ratingEntries.length} rated tracks`,
                'RatingBackupService',
                'createInitialBackupFromTracksAsync',
            );
        } catch (e: unknown) {
            this.logger.error(e, 'Could not create initial backup', 'RatingBackupService', 'createInitialBackupFromTracksAsync');
            // Don't throw - initial backup failure should not prevent app startup
        }

        return Promise.resolve();
    }

    public syncBackupFromTracksAsync(tracks: Track[]): Promise<void> {
        try {
            const meaningfulTracks = tracks.filter((track) => this.hasMeaningfulState(track.rating, track.love));

            if (meaningfulTracks.length === 0) {
                return Promise.resolve();
            }

            this.fileAccess.createFullDirectoryPathIfDoesNotExist(this._ratingsDirectoryPath);

            const backup = this.loadBackup();
            let numberOfChangedEntries = 0;

            for (const track of meaningfulTracks) {
                const nextEntry = this.createEntryFromTrack(track);
                const existingIndex = backup.ratings.findIndex((entry) => entry.trackPath === track.path);

                if (existingIndex < 0) {
                    backup.ratings.push(nextEntry);
                    numberOfChangedEntries++;
                    continue;
                }

                if (!this.entriesAreEqual(backup.ratings[existingIndex], nextEntry)) {
                    backup.ratings[existingIndex] = nextEntry;
                    numberOfChangedEntries++;
                }
            }

            if (numberOfChangedEntries > 0) {
                backup.lastBackupDate = Date.now();
                this.fileAccess.writeToFile(this._ratingsBackupPath, JSON.stringify(backup, undefined, 2));
                this.logger.info(
                    `Synced ratings backup from indexed tracks. Updated ${numberOfChangedEntries} entries.`,
                    'RatingBackupService',
                    'syncBackupFromTracksAsync',
                );
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not sync ratings backup from tracks', 'RatingBackupService', 'syncBackupFromTracksAsync');
        }

        return Promise.resolve();
    }

    public async deleteBackupAsync(): Promise<void> {
        try {
            if (this.fileAccess.pathExists(this._ratingsBackupPath)) {
                await this.fileAccess.deleteFileIfExistsAsync(this._ratingsBackupPath);
                this.logger.info('Deleted ratings backup file', 'RatingBackupService', 'deleteBackupAsync');
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not delete ratings backup', 'RatingBackupService', 'deleteBackupAsync');
        }
    }

    public async resetAutoRestoreGuardAsync(): Promise<void> {
        try {
            if (this.fileAccess.pathExists(this._autoRestoreGuardPath)) {
                await this.fileAccess.deleteFileIfExistsAsync(this._autoRestoreGuardPath);
                this.logger.info('Reset auto-restore guard file', 'RatingBackupService', 'resetAutoRestoreGuardAsync');
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not reset auto-restore guard file', 'RatingBackupService', 'resetAutoRestoreGuardAsync');
        }
    }

    /**
     * Finds a rating entry for a track using intelligent matching.
     * First tries to match by exact path, then falls back to artist+title matching.
     * @param track - The track to find a rating for
     * @param ratingEntries - Array of rating entries to search
     * @returns The matching rating entry, or undefined if no match found
     */
    public findRatingByTrack(track: TrackModel, ratingEntries: RatingEntry[]): RatingEntry | undefined {
        // First try: exact path match (most reliable)
        const pathMatch = ratingEntries.find((entry) => entry.trackPath === track.path);
        if (pathMatch) {
            this.logger.info(`Found rating by path match for '${track.path}'`, 'RatingBackupService', 'findRatingByTrack');
            return pathMatch;
        }

        // Second try: metadata match (fallback if user moved files)
        const normalizedTrackTitle = this.normalizeText(track.title);

        if (!StringUtils.isNullOrWhiteSpace(normalizedTrackTitle)) {
            const normalizedTrackArtists = this.normalizeArtistList(this.getArtistsFromModel(track));

            // Prefer title + full artist list to handle multi-artist tracks correctly.
            const exactArtistsMatch = ratingEntries.find((entry) => {
                const normalizedEntryTitle = this.normalizeText(entry.title ?? '');
                const normalizedEntryArtists = this.normalizeArtistList(this.getArtistsFromEntry(entry));

                return (
                    normalizedEntryTitle === normalizedTrackTitle &&
                    normalizedEntryArtists.length > 0 &&
                    this.sameStringArrays(normalizedEntryArtists, normalizedTrackArtists)
                );
            });

            if (exactArtistsMatch != undefined) {
                this.logger.info(
                    `Found rating by metadata artist-list match for '${track.path}'`,
                    'RatingBackupService',
                    'findRatingByTrack',
                );
                return exactArtistsMatch;
            }

            // Backward-compatible fallback for old backups with only a single artist field.
            const normalizedTrackPrimaryArtist = this.normalizeText(this.getPrimaryArtistFromModel(track));

            const primaryArtistMatch = ratingEntries.find((entry) => {
                const normalizedEntryTitle = this.normalizeText(entry.title ?? '');
                const normalizedEntryPrimaryArtist = this.normalizeText(this.getPrimaryArtistFromEntry(entry));

                return (
                    normalizedEntryTitle === normalizedTrackTitle &&
                    !StringUtils.isNullOrWhiteSpace(normalizedEntryPrimaryArtist) &&
                    normalizedEntryPrimaryArtist === normalizedTrackPrimaryArtist
                );
            });

            if (primaryArtistMatch != undefined) {
                this.logger.info(
                    `Found rating by metadata primary-artist match for '${track.path}'`,
                    'RatingBackupService',
                    'findRatingByTrack',
                );

                return primaryArtistMatch;
            }
        }

        return undefined;
    }

    /**
     * Checks if a rating entry matches a track (by path or metadata)
     * @param entry - Rating entry from backup
     * @param track - Track to compare against
     * @returns true if the entry matches this track
     */
    public ratingMatchesTrack(entry: RatingEntry, track: TrackModel): boolean {
        // Exact path match
        if (entry.trackPath === track.path) {
            return true;
        }

        const normalizedEntryTitle = this.normalizeText(entry.title ?? '');
        const normalizedTrackTitle = this.normalizeText(track.title);

        if (StringUtils.isNullOrWhiteSpace(normalizedEntryTitle) || StringUtils.isNullOrWhiteSpace(normalizedTrackTitle)) {
            return false;
        }

        if (normalizedEntryTitle !== normalizedTrackTitle) {
            return false;
        }

        const normalizedEntryArtists = this.normalizeArtistList(this.getArtistsFromEntry(entry));
        const normalizedTrackArtists = this.normalizeArtistList(this.getArtistsFromModel(track));

        if (normalizedEntryArtists.length > 0 && this.sameStringArrays(normalizedEntryArtists, normalizedTrackArtists)) {
            return true;
        }

        const normalizedEntryPrimaryArtist = this.normalizeText(this.getPrimaryArtistFromEntry(entry));
        const normalizedTrackPrimaryArtist = this.normalizeText(this.getPrimaryArtistFromModel(track));

        return (
            !StringUtils.isNullOrWhiteSpace(normalizedEntryPrimaryArtist) && normalizedEntryPrimaryArtist === normalizedTrackPrimaryArtist
        );
    }

    private getBackupTitleFromTrack(track: Track): string {
        if (!StringUtils.isNullOrWhiteSpace(track.trackTitle)) {
            return track.trackTitle!;
        }

        return track.fileName ?? '';
    }

    private getArtistsFromModel(track: TrackModel): string[] {
        return track.rawArtists;
    }

    private getPrimaryArtistFromModel(track: TrackModel): string {
        return track.rawFirstArtist;
    }

    private getArtistsFromTrack(track: Track): string[] {
        return DataDelimiter.fromDelimitedString(track.artists).filter((artist) => !StringUtils.isNullOrWhiteSpace(artist));
    }

    private getPrimaryArtistFromTrack(track: Track): string {
        const artists = this.getArtistsFromTrack(track);

        if (artists.length === 0) {
            return '';
        }

        return artists[0];
    }

    private getArtistsFromEntry(entry: RatingEntry): string[] {
        if (entry.artists != undefined && entry.artists.length > 0) {
            return entry.artists;
        }

        if (!StringUtils.isNullOrWhiteSpace(entry.artist)) {
            return [entry.artist!];
        }

        return [];
    }

    private getPrimaryArtistFromEntry(entry: RatingEntry): string {
        const artists = this.getArtistsFromEntry(entry);

        if (artists.length === 0) {
            return '';
        }

        return artists[0];
    }

    private normalizeText(value: string): string {
        return value.trim().toLowerCase();
    }

    private normalizeArtistList(artists: string[]): string[] {
        return artists
            .filter((artist) => !StringUtils.isNullOrWhiteSpace(artist))
            .map((artist) => this.normalizeText(artist))
            .sort();
    }

    private sameStringArrays(left: string[], right: string[]): boolean {
        if (left.length !== right.length) {
            return false;
        }

        return left.every((value, index) => value === right[index]);
    }

    private restoreMissingRatingsFromBackup(tracks: Track[], ratingEntries: RatingEntry[]): number {
        if (ratingEntries.length === 0) {
            return 0;
        }

        let restoredCount = 0;

        for (const track of tracks) {
            if (track.trackId === undefined || track.trackId <= 0) {
                continue;
            }

            const rating = track.rating ?? 0;
            const love = track.love ?? 0;

            // Only restore when metadata appears missing in DB.
            if (rating !== 0 || love !== 0) {
                continue;
            }

            const matchingEntry = this.findMatchingEntryForTrack(track, ratingEntries);

            if (matchingEntry == undefined) {
                continue;
            }

            this.trackRepository.updateRating(track.trackId, matchingEntry.rating ?? 0);
            this.trackRepository.updateLove(track.trackId, matchingEntry.love ?? 0);
            restoredCount++;
        }

        return restoredCount;
    }

    private findMatchingEntryForTrack(track: Track, ratingEntries: RatingEntry[]): RatingEntry | undefined {
        const pathMatch = ratingEntries.find((entry) => entry.trackPath === track.path);

        if (pathMatch != undefined) {
            return pathMatch;
        }

        const normalizedTrackTitle = this.normalizeText(this.getBackupTitleFromTrack(track));

        if (StringUtils.isNullOrWhiteSpace(normalizedTrackTitle)) {
            return undefined;
        }

        const normalizedTrackArtists = this.normalizeArtistList(this.getArtistsFromTrack(track));

        const exactArtistsMatch = ratingEntries.find((entry) => {
            const normalizedEntryTitle = this.normalizeText(entry.title ?? '');
            const normalizedEntryArtists = this.normalizeArtistList(this.getArtistsFromEntry(entry));

            return (
                normalizedEntryTitle === normalizedTrackTitle &&
                normalizedEntryArtists.length > 0 &&
                this.sameStringArrays(normalizedEntryArtists, normalizedTrackArtists)
            );
        });

        if (exactArtistsMatch != undefined) {
            return exactArtistsMatch;
        }

        const normalizedTrackPrimaryArtist = this.normalizeText(this.getPrimaryArtistFromTrack(track));

        return ratingEntries.find((entry) => {
            const normalizedEntryTitle = this.normalizeText(entry.title ?? '');
            const normalizedEntryPrimaryArtist = this.normalizeText(this.getPrimaryArtistFromEntry(entry));

            return (
                normalizedEntryTitle === normalizedTrackTitle &&
                !StringUtils.isNullOrWhiteSpace(normalizedEntryPrimaryArtist) &&
                normalizedEntryPrimaryArtist === normalizedTrackPrimaryArtist
            );
        });
    }

    private hasMeaningfulState(rating: number | undefined | null, love: number | undefined | null): boolean {
        return (rating ?? 0) > 0 || (love ?? 0) > 0;
    }

    private createEntryFromTrack(track: Track): RatingEntry {
        return {
            trackPath: track.path,
            rating: track.rating ?? 0,
            love: track.love ?? 0,
            artist: this.getPrimaryArtistFromTrack(track),
            artists: this.getArtistsFromTrack(track),
            title: this.getBackupTitleFromTrack(track),
        };
    }

    private entriesAreEqual(left: RatingEntry, right: RatingEntry): boolean {
        return (
            left.trackPath === right.trackPath &&
            left.rating === right.rating &&
            left.love === right.love &&
            this.normalizeText(left.title ?? '') === this.normalizeText(right.title ?? '') &&
            this.normalizeText(this.getPrimaryArtistFromEntry(left)) === this.normalizeText(this.getPrimaryArtistFromEntry(right)) &&
            this.sameStringArrays(
                this.normalizeArtistList(this.getArtistsFromEntry(left)),
                this.normalizeArtistList(this.getArtistsFromEntry(right)),
            )
        );
    }

    private getMeaningfulEntries(entries: RatingEntry[]): RatingEntry[] {
        return entries.filter((entry) => this.hasMeaningfulState(entry.rating, entry.love));
    }

    private getAutoRestoreSafetyDiagnostics(tracks: Track[], meaningfulEntries: RatingEntry[]): AutoRestoreSafetyDiagnostics {
        if (meaningfulEntries.length === 0) {
            return {
                isSafe: false,
                reason: 'No meaningful backup entries found',
                tracksWithDbState: 0,
                maxSafeExistingState: 0,
                confidentlyMatchableMissingTracks: 0,
                minimumExpectedMatches: 0,
                meaningfulEntriesCount: 0,
                tracksCount: tracks.length,
            };
        }

        const tracksWithDbState = tracks.filter((track) => this.hasMeaningfulState(track.rating, track.love)).length;
        const maxSafeExistingState = 0;

        let confidentlyMatchableMissingTracks = 0;

        for (const track of tracks) {
            if (this.hasMeaningfulState(track.rating, track.love)) {
                continue;
            }

            const matchingEntry = this.findMatchingEntryForTrack(track, meaningfulEntries);

            if (matchingEntry != undefined) {
                confidentlyMatchableMissingTracks++;
            }
        }

        // Restore is additive only (writes only to missing DB state), so require at least one confident match.
        const minimumExpectedMatches = 1;

        const isSafe = confidentlyMatchableMissingTracks >= minimumExpectedMatches;

        return {
            isSafe,
            reason: isSafe ? 'Safe to auto-restore' : 'No confidently matchable missing tracks',
            tracksWithDbState,
            maxSafeExistingState,
            confidentlyMatchableMissingTracks,
            minimumExpectedMatches,
            meaningfulEntriesCount: meaningfulEntries.length,
            tracksCount: tracks.length,
        };
    }

    private markAutoRestoreAttempted(): void {
        this.fileAccess.createFullDirectoryPathIfDoesNotExist(this._ratingsDirectoryPath);
        this.fileAccess.writeToFile(this._autoRestoreGuardPath, `${Date.now()}`);
    }
}
