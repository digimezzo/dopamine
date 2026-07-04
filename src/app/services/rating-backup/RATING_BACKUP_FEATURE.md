# Rating Backup Feature

## Overview

The Rating Backup Feature automatically backs up all track ratings and love status to a separate JSON file in the Music/Dopamine directory. This provides a safeguard against database corruption or data loss, allowing users to restore their entire rating history without having to re-rate songs.

## How It Works

### Automatic Backup

Every time you:

- Rate a track (0-10 stars, including half-stars)
- Mark a track as loved/unloved (heart icon)

Dopamine automatically backs up the track's rating and love status to a JSON file:

```
Music/
└── Dopamine/
    └── Ratings/
        └── ratings-backup.json
```

If the Music directory is not accessible, the backup is saved to:

```
[Application Data Directory]/Ratings/ratings-backup.json
```

On Linux: `~/.config/Dopamine/Ratings/ratings-backup.json`
On Windows: `C:\Users\[YourUsername]\AppData\Roaming\Dopamine\Ratings\ratings-backup.json`
On macOS: `~/Library/Application Support/Dopamine/Ratings/ratings-backup.json`

### Initial Backup for Existing Ratings

If you're upgrading from a version before this feature was added, **all your existing ratings are automatically backed up on first app launch**:

- When you first start Dopamine with this feature, it scans your music library
- All songs you've already rated are backed up to the JSON file
- This is a one-time operation and doesn't slow down app startup
- No manual action required from you

This ensures that even users with years of ratings won't lose any data!

### Backup File Format

The backup file is a JSON file containing:

```json
{
    "version": 1,
    "lastBackupDate": 1718342400000,
    "ratings": [
        {
            "trackPath": "/path/to/song1.mp3",
            "rating": 8,
            "love": 1,
            "artist": "Artist Name",
            "title": "Song Title"
        },
        {
            "trackPath": "/path/to/song2.mp3",
            "rating": 10,
            "love": 0,
            "artist": "Another Artist",
            "title": "Another Song"
        }
    ]
}
```

**Fields:**

- `version`: Backup format version (currently 1)
- `lastBackupDate`: Unix timestamp of the last backup
- `ratings`: Array of rating entries
    - `trackPath`: Full path to the audio file
    - `rating`: Rating value (0-10, supporting half-stars)
    - `love`: Love status (0 = not loved, 1 = loved)
    - `artist`: Track artist(s) - used as fallback for matching if files are moved
    - `title`: Track title - used as fallback for matching if files are moved

## Use Cases

### Handling File Moves

When you restore ratings from backup, Dopamine uses **intelligent matching**:

1. **Path-based matching** (most reliable)
    - Looks for exact file path match
    - Works perfectly if files haven't moved

2. **Metadata-based matching** (fallback for reorganization)
    - If path doesn't match, tries to match by Artist + Title
    - Ensures ratings are preserved even if you reorganized your music collection
    - Example: If you moved `Old/Music/song.mp3` → `New/Music/Library/song.mp3`, the same artist+title will still find the rating

This two-tier approach means **your ratings are safe even if you move files around or reorganize your music library**.

### Database Recovery

If your Dopamine database becomes corrupted and needs to be reset:

1. **Before resetting**, note that your ratings are safely backed up in the JSON file
2. **Reset the database** (if needed)
3. **Restore ratings** from the backup using the rating backup management tools (coming in future updates)
    - This will use the intelligent matching to find the correct tracks
    - Even if you've reorganized your music, artist+title matching will restore most/all ratings

### Manual Inspection

You can manually open the `ratings-backup.json` file to:

- View all your rated tracks
- Check the backup date
- Verify ratings were backed up correctly

### Migration Between Devices

If you're setting up Dopamine on a new device:

1. Copy the `ratings-backup.json` from your old Music/Dopamine/Ratings directory
2. Place it in the same location on your new device
3. (Future feature) Use the restore function to import all ratings

## Technical Details

### Implementation

The rating backup system is implemented via the `RatingBackupService`:

**Location:** `src/app/services/rating-backup/rating-backup.service.ts`

**Key Methods:**

- `backupTrackRatingAsync(track)` - Backs up a single track's rating and love status
- `backupTrackLoveAsync(track)` - Backs up love changes without changing existing rating values
- `loadBackup()` - Loads the current backup file
- `createInitialBackupFromTracksAsync(tracksWithRatings)` - Creates first backup for existing users
- `tryAutoRestoreOnStartupAsync(currentTracks)` - Attempts a guarded auto-restore when confidence is high
- `deleteBackupAsync()` - Removes the backup file

### Integration

The `RatingBackupService` is integrated into the `MetadataService`, which is responsible for handling all rating and love status changes. When you save a rating through the UI, the backup happens automatically in the background.

### Error Handling

If a backup operation fails:

- The error is logged to the Dopamine logs (`logs/Dopamine.log`)
- The operation doesn't prevent the rating from being saved to the database
- You can check the logs to diagnose backup issues

## Logging

All backup operations are logged with details:

- Successfully backed up rating for track
- Loaded ratings backup with X entries
- Restored X ratings from backup
- Failed to backup/restore (with error details)

Check the log file at:

- Linux: `~/.config/Dopamine/logs/Dopamine.log`
- Windows: `C:\Users\[YourUsername]\AppData\Roaming\Dopamine\logs\Dopamine.log`
- macOS: `~/Library/Application Support/Dopamine/logs/Dopamine.log`

## Future Enhancements

Planned features for future releases:

- UI option to manually restore ratings from backup
- Bulk backup/export functionality
- Backup versioning and rotation
- Configurable backup location and frequency
- Comparison tool to merge ratings from multiple backups

## FAQ

**Q: Will this backup slow down Dopamine?**
A: No, backups are written synchronously to disk and the file is small (typically <1MB for thousands of ratings), so there's negligible performance impact.

**Q: Can I disable backups?**
A: Currently, backups are always enabled. Future versions may add a setting to disable them.

**Q: Where exactly is my backup stored?**
A: By default, in `Music/Dopamine/Ratings/ratings-backup.json`. You can inspect this file directly using any text editor.

**Q: What if I accidentally delete the backup?**
A: As long as your Dopamine database is intact, your ratings are still safe in the database. If both the database and backup are gone, ratings cannot be recovered.

**Q: What happens if I move my music files to a different directory?**
A: No problem! The backup stores both the file path and metadata (artist/title). When restoring:

- Dopamine first tries to match by exact file path
- If the path has changed, it falls back to matching by artist+title
- This ensures ratings are preserved even after reorganizing your music library

**Q: What if I have multiple songs with the same artist and title?**
A: Dopamine will apply the rating to the first matching track. If you have exact duplicates, consider using unique metadata (different album, track number, etc.) to differentiate them. Ideally, duplicate tracks should have the same rating anyway.

**Q: Will old backups be kept?**
A: Currently, only one backup file is maintained. Each new rating update overwrites the previous backup. Future versions may support versioning.

## Troubleshooting

### Backup file not being created

1. Check that the Music/Dopamine directory is accessible
2. Ensure you have write permissions to that directory
3. Check the Dopamine logs for error messages
4. Try rating a track again and check if the file appears

### Cannot restore from backup

Automatic restore is already attempted on startup when Dopamine detects a high-confidence scenario (for example, after a database reset with many matching tracks in backup).

If restore did not run, check:

1. The backup file exists and has entries
2. Your current library scan completed and includes those tracks
3. Track path or artist/title metadata still match
4. Logs for confidence-check and restore diagnostics

### Ratings not being backed up

1. Check Dopamine logs for errors during rating save
2. Verify the Music/Dopamine/Ratings directory exists
3. Ensure sufficient disk space
4. Restart Dopamine and try rating a track again

## Support

If you encounter issues with the rating backup feature, please:

1. Check the logs in `[ApplicationData]/logs/Dopamine.log`
2. Open an issue on GitHub with:
    - Your operating system
    - Dopamine version
    - A description of the problem
    - Relevant log entries
