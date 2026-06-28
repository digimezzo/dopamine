# Rating Backup - Developer Reference

## Quick Integration Guide

### Service Injection

```typescript
import { RatingBackupService } from './rating-backup.service';

export class MyService {
    constructor(private ratingBackupService: RatingBackupService) {}
}
```

### Basic Usage

#### Backup a Track

```typescript
// Backup occurs automatically when rating is changed via MetadataService
// But you can also manually trigger backup:
await this.ratingBackupService.backupTrackRatingAsync(track);
```

#### Load Backup

```typescript
// Load all backed up ratings
const backup = this.ratingBackupService.loadBackup();
console.log(`Found ${backup.ratings.length} backed up ratings`);
console.log(`Last backup: ${new Date(backup.lastBackupDate)}`);
```

#### Startup Auto-Restore Check

```typescript
await this.ratingBackupService.createInitialBackupFromTracksAsync(currentTracks);
await this.ratingBackupService.tryAutoRestoreOnStartupAsync(currentTracks);
```

#### Delete Backup

```typescript
await this.ratingBackupService.deleteBackupAsync();
```

## Service API Reference

### Properties

```typescript
// Read-only paths for accessing backup files
public ratingsBackupPath: string;          // Full path to backup file
public ratingsDirectoryPath: string;       // Directory containing backup
```

### Methods

```typescript
// Backup a track's rating and love status
public async backupTrackRatingAsync(track: TrackModel): Promise<void>

// Load existing backup (returns empty backup if file doesn't exist)
public loadBackup(): RatingBackup

// Backup love status changes without clobbering existing ratings
public async backupTrackLoveAsync(track: TrackModel): Promise<void>

// Create initial backup from existing rated tracks (for users upgrading from before the feature)
public async createInitialBackupFromTracksAsync(tracksWithRatings: Track[]): Promise<void>

// Attempt one-time guarded auto-restore on startup
public async tryAutoRestoreOnStartupAsync(currentTracks: Track[]): Promise<void>

// Delete the backup file
public async deleteBackupAsync(): Promise<void>

// Find a rating for a track using intelligent matching (path first, then metadata)
public findRatingByTrack(track: TrackModel, ratingEntries: RatingEntry[]): RatingEntry | undefined

// Check if a rating entry matches a track (by path or metadata)
public ratingMatchesTrack(entry: RatingEntry, track: TrackModel): boolean

```

## Data Structures

### RatingBackup Interface

```typescript
interface RatingBackup {
    version: number; // Format version (currently 1)
    lastBackupDate: number; // Unix timestamp
    ratings: RatingEntry[]; // Array of backed up ratings
}
```

### RatingEntry Interface

```typescript
interface RatingEntry {
    trackPath: string; // Full path to audio file
    rating: number; // Rating 0-10 (supports half-stars)
    love: number; // 0 = not loved, 1 = loved
    artist?: string; // Track artist(s) - fallback for matching
    title?: string; // Track title - fallback for matching
}
```

## Integration Points

### MetadataService Integration

**Location**: `src/app/services/metadata/metadata.service.ts`

**When Backup Occurs**:

- `saveTrackRatingAsync(track)` - After rating is saved to database
- `saveTrackLove(track)` - After love status is saved to database

**Implementation Pattern**:

```typescript
public async saveTrackRatingAsync(track: TrackModel): Promise<void> {
    try {
        this.trackRepository.updateRating(track.id, track.rating);

        // ... other operations ...

        // Backup the rating
        await this.ratingBackupService.backupTrackRatingAsync(track);

        this.ratingSaved.next(track);
    } catch (e) {
        // ... error handling ...
    }
}
```

## File System Paths

### Backup Location Resolution

```
1. Try Music Directory:
   Music/Dopamine/Ratings/ratings-backup.json

2. If Music Directory Not Found:
   [ApplicationDataDirectory]/Ratings/ratings-backup.json

3. Platform-Specific Defaults:
   - Linux: ~/.config/Dopamine/Ratings/
   - Windows: %APPDATA%/Dopamine/Ratings/
   - macOS: ~/Library/Application Support/Dopamine/Ratings/
```

### Location Detection

```typescript
// Determined in initialize() method
private initialize(): void {
    let musicDirectory = this.desktop.getMusicDirectory();

    if (musicDirectory exists) {
        ratingsPath = musicDirectory + '/Dopamine/Ratings'
    } else {
        ratingsPath = appDataDirectory + '/Ratings'
    }
}
```

## Intelligent Matching for Moved Files

### Startup Wiring Example

```typescript
export class AppComponent {
    constructor(private ratingBackupService: RatingBackupService) {}

    async createInitialRatingsBackupAndAutoRestoreIfNeededAsync(): Promise<void> {
        const tracks = this.trackRepository.getVisibleTracks();

        if (!tracks || tracks.length === 0) {
            return;
        }

        await this.ratingBackupService.createInitialBackupFromTracksAsync(tracks);
        await this.ratingBackupService.tryAutoRestoreOnStartupAsync(tracks);
    }
}
```

### Export Ratings Example

```typescript
export class RatingExportService {
    constructor(private ratingBackupService: RatingBackupService) {}

    async exportRatingsToJsonAsync(filePath: string): Promise<void> {
        const backup = this.ratingBackupService.loadBackup();
        const json = JSON.stringify(backup, null, 2);
        // Write to filePath
    }
}
```

## Error Handling

### Graceful Degradation

Backup failures **do not block** rating saves:

```typescript
try {
    this.trackRepository.updateRating(track.id, track.rating);

    // Backup is best-effort
    await this.ratingBackupService.backupTrackRatingAsync(track);

    this.ratingSaved.next(track);
} catch (e) {
    // Rating is saved, backup failure is logged but not fatal
}
```

### Logging

All operations are logged:

```typescript
private logger: Logger;

// In service:
this.logger.info(
    `Backed up rating for track '${track.path}'`,
    'RatingBackupService',
    'backupTrackRatingAsync'
);

this.logger.error(
    error,
    'Could not backup track rating',
    'RatingBackupService',
    'backupTrackRatingAsync'
);
```

**Check logs at**: `~/.config/Dopamine/logs/Dopamine.log`

## Initial Backup for Existing Ratings

For users upgrading from before the backup feature was implemented, an initial backup should be created from all existing rated tracks in the database.

### When to Call

Call `createInitialBackupFromTracksAsync()` during app initialization (e.g., in `AppComponent.ngOnInit()`):

```typescript
export class AppComponent implements OnInit {
    constructor(
        private ratingBackupService: RatingBackupService,
        private trackRepository: TrackRepositoryBase,
        private logger: Logger,
    ) {}

    public ngOnInit(): void {
        // ... other initialization code ...

        // Create initial backup for users upgrading from before the feature
        this.createInitialBackupIfNeeded();
    }

    private createInitialBackupIfNeeded(): void {
        try {
            // Get all tracks from database
            const allTracks = this.trackRepository.getVisibleTracks();

            if (allTracks && allTracks.length > 0) {
                // Create initial backup (safely handles existing backups)
                this.ratingBackupService.createInitialBackupFromTracksAsync(allTracks).catch((e) => {
                    this.logger.error(e, 'Could not create initial backup', 'AppComponent', 'createInitialBackupIfNeeded');
                    // Non-critical error - don't block app startup
                });
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not create initial backup', 'AppComponent', 'createInitialBackupIfNeeded');
        }
    }
}
```

### How It Works

1. **Safe to Call Repeatedly** - Method returns early if backup file already exists
2. **Filters Unrated Tracks** - Only backs up tracks with rating > 0
3. **Extracts Metadata** - Converts Track entities to RatingEntry format with artist/title
4. **Non-Blocking** - Errors don't prevent app startup
5. **Logged** - Success/skip/error all logged for debugging

### Result

After first app launch with the feature:

- Users with existing ratings: `ratings-backup.json` created with all rated tracks
- Users with no ratings: Backup creation skipped gracefully
- All future rating changes automatically backed up

### Example Scenarios

**User A**: Upgraded with 500 rated songs

- First launch: Initial backup creates `ratings-backup.json` with 500 entries
- All metadata preserved for future restore operations

**User B**: Upgraded with no ratings

- First launch: Backup creation skipped (no rated tracks)
- When they rate first song: Backup file created automatically

**User C**: Already had backup from previous launch

- Subsequent launches: Method returns early, no duplicate backup

## Intelligent Matching for Moved Files

The `findRatingByTrack` method implements a two-tier matching strategy:

### Tier 1: Path-Based Matching (Most Reliable)

```typescript
const rating = backup.ratings.find((r) => r.trackPath === track.path);
```

- Fastest and most accurate
- Works when files haven't been moved or reorganized

### Tier 2: Metadata-Based Matching (Fallback)

```typescript
const rating = backup.ratings.find((r) => r.artist === track.artists && r.title === track.trackTitle);
```

- Activates when path doesn't match
- Allows ratings to survive file reorganization
- Example: User moves `Music/Song.mp3` → `Music/2024/Song.mp3`
    - Path: `/Music/Song.mp3` → `/Music/2024/Song.mp3` (doesn't match)
    - Metadata: "Artist" + "Title" (still matches!)

### Usage in Restore Function

```typescript
async function restoreRatings(): Promise<void> {
    const backup = this.ratingBackupService.loadBackup();

    for (const backupEntry of backup.ratings) {
        // Try to find the track in current database
        const track = this.findTrackInDatabase(backupEntry.trackPath);

        if (track) {
            // Found by path - exact match
            track.rating = backupEntry.rating;
            track.love = backupEntry.love;
        } else {
            // Try metadata matching
            const alternateTrack = this.findTrackByMetadata(backupEntry.artist, backupEntry.title);

            if (alternateTrack) {
                alternateTrack.rating = backupEntry.rating;
                alternateTrack.love = backupEntry.love;
                this.logger.info(`Matched by metadata: "${backupEntry.artist} - ${backupEntry.title}"`);
            }
        }
    }
}
```

### Helper Methods

Use these methods to integrate matching into UI components:

```typescript
// Find a single rating for a track
const ratingEntry = this.ratingBackupService.findRatingByTrack(track, backup.ratings);

if (ratingEntry) {
    console.log(`Found rating: ${ratingEntry.rating} stars`);
}

// Check if an entry matches a track
const matches = this.ratingBackupService.ratingMatchesTrack(backupEntry, track);
```

### Unit Test Pattern

```typescript
describe('RatingBackupService', () => {
    let service: RatingBackupService;
    let fileAccessMock: IMock<FileAccessBase>;

    beforeEach(() => {
        fileAccessMock = Mock.ofType<FileAccessBase>();
        // Setup mocks...
        service = new RatingBackupService(
            fileAccessMock.object,
            desktopMock.object,
            loggerMock.object
        );
    });

    it('should backup track rating', async () => {
        // Arrange
        fileAccessMock.setup(x => x.writeToFile(...)).returns(() => {});

        // Act
        await service.backupTrackRatingAsync(track);

        // Assert
        fileAccessMock.verify(
            x => x.writeToFile(...),
            Times.once()
        );
    });
});
```

## Performance Considerations

- **File Size**: Typical backup < 1MB for 10,000+ rated tracks
- **Write Time**: < 1ms for typical backup
- **Memory**: Minimal - only loads backup when needed
- **Frequency**: On every rating change (typically < 1 backup per second during active use)

## Security Considerations

- Backup file is **plain JSON** (human-readable)
- Stored in user's Music directory (same permissions as music files)
- No encryption (future enhancement)
- No sensitive data beyond track paths and ratings

## Versioning

Current backup format: **Version 1**

### Upgrade Path for Future Versions

```typescript
public loadBackup(): RatingBackup {
    const backup = JSON.parse(content);

    if (backup.version === 1) {
        return backup;  // Current format
    } else if (backup.version === 2) {
        return this.migrateFromV2(backup);
    }

    // Unknown version
    return this.createEmptyBackup();
}
```

## Related Files

- **Service**: `src/app/services/rating-backup/rating-backup.service.ts`
- **Tests**: `src/app/services/rating-backup/rating-backup.service.spec.ts`
- **Integration**: `src/app/services/metadata/metadata.service.ts`
- **Feature Docs**: `src/app/services/rating-backup/RATING_BACKUP_FEATURE.md`
- **Implementation**: `/RATING_BACKUP_IMPLEMENTATION.md`

## Troubleshooting

### Backup File Not Created

1. Check Music directory exists: `this.desktop.getMusicDirectory()`
2. Check write permissions: `fileAccess.createFullDirectoryPathIfDoesNotExist()`
3. Check logs for errors

### Rating Not in Backup

1. Verify `saveTrackRatingAsync()` was called
2. Check logger output for backup confirmation
3. Verify backup file path is correct
4. Check file is valid JSON

### Restore Not Working

- **Feature coming soon** - Currently backups are created, restore functionality is planned
- In the meantime, manually manage backup file or use database tools

## Contact & Support

For issues or feature requests related to rating backups:

- Check logs: `~/.config/Dopamine/logs/Dopamine.log`
- Review this documentation
- Check GitHub issues for similar reports
